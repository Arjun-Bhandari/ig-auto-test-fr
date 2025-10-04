"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createAutomation,
  listAutomations,
  getIgMedia,
  updateAutomationStatus,
  getIgUser,
} from "../../lib/instagram/services";
import { CAMAPAIGN_TYPE } from "@/templates/templates";
import { useMediaSelection } from "../../stores/media-selection";
import { useIgUser } from "../../stores/ig-user-store";
import { useAutomationPreview } from "@/stores/automation-preview";
import { IgConnectButton } from "../ig-connect";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap } from "lucide-react";

import { PhoneMockup } from "./phone-mockup-preview";
import { ProgressIndicator } from "./automation-flowui/ProgressIndicator";
import { MediaSelectionStep } from "./automation-flowui/MediaSelectionStep";
import { KeywordSelectionStep } from "./automation-flowui/KeywordSelectionStep";
import { DmStep } from "./automation-flowui/DmStep";
import { StepNavigation } from "./automation-flowui/StepNavigatioin";
import { MediaSelectionDialog } from "./automation-flowui/MediaSelectionDialog";
import { CommentReplyStep } from "./automation-flowui/CommetReplyStep";
export default function AutomationFlow() {
  const { slug } = useParams();
  const { selectedMediaId } = useMediaSelection();
  const setMedia = useMediaSelection((state) => state.setMedia);
  const preview = useAutomationPreview();
  const [automationRule, setAutomationRule] = useState<any[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [template, setTemplate] = useState<any>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGoLiveLoading, setIsGoLiveLoading] = useState(false);
  const [automationId, setAutomationId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
const [accessToken, setAccessToken] = useState<string | null>(null)
  const router = useRouter();
  const campaignType =
    slug === "comment-reply" || slug === "comment-reply-dm"
      ? (slug as "comment-reply" | "comment-reply-dm")
      : "comment-reply";

  const totalSteps = campaignType === "comment-reply" ? 2 : 3;
  // Find selected template from local templates by slug id
  const selectedTemplate = CAMAPAIGN_TYPE.find((t) => t.id === slug);
  console.log("SELECTED TEMPLATE", selectedTemplate);

  useEffect(() => {
    if (typeof window !== "undefined")
     setRefreshToken(localStorage.getItem("refreshToken"))
    setAccessToken(localStorage.getItem("accessToken"))
  }, []);

  // Initialize template from local TEMPLATES once
  useEffect(() => {
    setIsLoadingTemplate(true);

    setTemplate(selectedTemplate || null);
    setIsLoadingTemplate(false);
  }, [selectedTemplate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!refreshToken && !accessToken) return;

      try {
        // Fetch media
        const mediaData = await getIgMedia(24);
        setMedia(mediaData);

        // Fetch user
        const userResponse = await getIgUser();
        console.log("User Response", userResponse)
        useIgUser.getState().setUser(userResponse);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [refreshToken, accessToken]);

  const canSubmit = Boolean(
    refreshToken || accessToken &&
      selectedMediaId &&
      preview.replyText
  );

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  console.log("INCLUDE KEYWORD", preview.includeKeywords);
  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return Boolean(selectedMediaId);
      case 2:
        return Boolean(preview.includeKeywords.length > 0 && preview.replyText);
  
      case 3:
        return campaignType === "comment-reply-dm"
          ? Boolean(preview.dmText || preview.buttonUrl || preview.buttonLabel)
          : true;
      default:
        return false;
    }
  };

  const handleSave = async () => {
    if (!accessToken && !refreshToken || !selectedMediaId) return;

    try {
      setIsSaving(true);

      const processedTemplate = template;
      if (!processedTemplate) throw new Error("Template not available");

      let replyText = preview.replyText;
     
      if (!replyText) {
        replyText = "Automated reply";
      }

      const actions = [] as any[];
      if (preview.replyText) {
        actions.push({
          type: "comment_reply",
          text: replyText,
        });
      } else {
        actions.push({ type: "comment_reply", text: replyText });
      }
      if (campaignType === "comment-reply-dm") {
        actions.push({
          type: "send_dm",
          text: preview.dmText || "Thank you!",
          buttons: preview.buttonUrl
            ? [
                {
                  type: "url",
                  label: preview.buttonLabel || "Open",
                  url: preview.buttonUrl,
                },
              ]
            : [],
        });
      }

      const match: any = {};
      if (preview.includeKeywords.length > 0)
        match.include = preview.includeKeywords;
      if (preview.regex) match.regex = preview.regex;

      const rule = {
        trigger: {
          type: "comment_created",
          mediaId: selectedMediaId,
          match: Object.keys(match).length ? match : undefined,
        },
        actions,
      };

      const automationResponse = await createAutomation({
        
        campaignType: campaignType,
        mediaId: selectedMediaId,
        name: selectedTemplate?.title || "Automation",
        rule,
        isActive: true,
        status: "ACTIVE",
      } as any);
console.log("Automation Response", automationResponse)
      if ((automationResponse as any).success) {
        setAutomationId((automationResponse as any).data.id);
        // const automationsRule = await listAutomations(igUserId);
        // setAutomationRule(automationsRule.data);
        alert("Automation created successfully!");
      }
      

      router.push(`/automation`);
    } catch (error) {
      console.error("Error creating automation:", error);
      alert("Failed to create automation");
    } finally {
      preview.reset();
      const media = useMediaSelection.getState();
      media.clear();
      setIsSaving(false);
    }
  };

  const handleToggleActive = async () => {
    setIsGoLiveLoading(true);
    if (!automationId) return;

    try {
      const newIsActive = !isActive;
      const newStatus = newIsActive ? "ACTIVE" : "PAUSED";

      const response = await updateAutomationStatus( {
        status:newStatus,
        isActive:newIsActive
      },automationId);

      if (response) {
        setIsActive(newIsActive);
        // Update local automation list
        const automationsRule = await listAutomations();
        setAutomationRule(automationsRule.data);
      }
    } catch (error) {
      console.error("Error updating automation status:", error);
      alert("Failed to update automation status");
    } finally {
      setIsGoLiveLoading(false);
    }
  };
  useEffect(() => {
    return () => {
      preview.reset();
      const media = useMediaSelection.getState();
      media.clear();
    };
  }, []);

  if (!refreshToken && !accessToken) {
    return (
      <div className="flex h-screen bg-[#12111A] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-4">
            Connect to Instagram
          </h2>
          <p className="text-white/60 mb-6">
            You need to connect your Instagram account to create automations.
          </p>
          <IgConnectButton />
        </div>
      </div>
    );
  }

  if (isLoadingTemplate) {
    return (
      <div className="flex h-screen bg-[#12111A] items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-white mb-4">
            Loading Template...
          </div>
          <div className="text-white/60">
            Please wait while we load your template.
          </div>
        </div>
      </div>
    );
  }

  if (selectedTemplate && !template) {
    return (
      <div className="flex h-screen bg-[#12111A] items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-white mb-4">
            Template Not Found
          </div>
          <div className="text-white/60 mb-6">
            The selected template could not be loaded.
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#12111A]">
      <div className="w-80 border-r border-white/10 overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4 text-white" />
            <h1 className="text-lg font-semibold text-white">
              {campaignType === "comment-reply"
                ? "When Comment Received on"
                : "When Comment Received on"}
            </h1>
          </div>

          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        </div>

        <div className="p-4">
          {currentStep === 1 && (
            <MediaSelectionStep onShowModal={() => setShowMediaModal(true)} />
          )}
          {currentStep === 2 && <KeywordSelectionStep />}

          {currentStep === 3 && <DmStep />}

          {/* Navigation Buttons */}
          <StepNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            canProceedToNext={canProceedToNext()}
            canSubmit={canSubmit}
            isSaving={isSaving}
            automationId={automationId}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSave={handleSave}
          />
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="h-full mt-24">
          <PhoneMockup campaignType={campaignType} currentStep={currentStep} />
        </div>
      </div>

      <div className="">
        <div className="flex items-center gap-2">
          {automationId && (
            <Button
              variant="outline"
              onClick={handleToggleActive}
              className="bg-violet-600 hover:bg-violet-700 text-white text-xs px-3 py-1"
            >
              {isGoLiveLoading ? (
                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-1"></div>
              ) : isActive ? (
                "Stop"
              ) : (
                "Go Live"
              )}
            </Button>
          )}
        </div>
      </div>

      <MediaSelectionDialog
        open={showMediaModal}
        onOpenChange={setShowMediaModal}
      />
    </div>
  );
}
