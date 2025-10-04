"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft} from "lucide-react";
import { PhoneMockup } from "../phone-mockup-preview";
import { ProgressIndicator } from "../automation-flowui/ProgressIndicator";
import { MediaSelectionStep } from "../automation-flowui/MediaSelectionStep";
import { KeywordSelectionStep } from "../automation-flowui/KeywordSelectionStep";
import { DmStep } from "../automation-flowui/DmStep";
import { StepNavigation } from "../automation-flowui/StepNavigatioin";
import { MediaSelectionDialog } from "../automation-flowui/MediaSelectionDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAutomationPreview } from "@/stores/automation-preview";
import { useMediaSelection } from "@/stores/media-selection";
import { useIgUser } from "@/stores/ig-user-store";

import {
  getAutomationById,
  getIgMedia,
  getIgUser,
  updateAutomation,
  updateAutomationStatus,
} from "@/lib/instagram/services";

interface AutomationDTO {
  id: string;
  status: string;
  isActive: boolean;
  igUserId: string;
  mediaId: string;
  name?: string;
  campaignType?: string;
  rule: {
    trigger: {
      type: string;
      mediaId?: string;
      match?: {
        include?: string[];
        contains?: string[];
        regex?: string;
      };
    };
    actions: Array<{
      type: "comment_reply" | "send_dm" | string;
      text?: string;
      responses?: string[];
      randomize?: boolean;
      buttons?: Array<{ type: "url"; label: string; url: string }>;
    }>;
  };
}

const inferCampaignType = (
  a: AutomationDTO
): "comment-reply" | "comment-reply-dm" => {
  const hasDm = a.rule.actions.some((x) => x.type === "send_dm");
  return hasDm ? "comment-reply-dm" : "comment-reply";
};

export function EditAutomation() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const query = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  const preview = useAutomationPreview();
  const mediaStore = useMediaSelection();
  const userStore = useIgUser();

  const [igUserId, setIgUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [regex, setRegex] = useState<string>(""); // only local state we keep
  const [automation, setAutomation] = useState<AutomationDTO | null>(null);
  const [isGoLiveLoading, setIsGoLiveLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<"ACTIVE" | "PAUSED" | string>("PAUSED");

  const campaignType = useMemo<"comment-reply" | "comment-reply-dm">(() => {
    const q = query.campaign_type as
      | "comment-reply"
      | "comment-reply-dm"
      | undefined;
    if (q === "comment-reply" || q === "comment-reply-dm") return q;
    if (automation) return inferCampaignType(automation);
    return "comment-reply";
  }, [query.campaign_type, automation]);

  const totalSteps = campaignType === "comment-reply" ? 2 : 3;


  useEffect(() => {
    if (typeof window !== "undefined") {
      setIgUserId(localStorage.getItem("igUserId"));
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!igUserId || !id) return;
      try {
        setLoading(true);

        // user
        const userRes = await getIgUser();
        userStore.setUser(userRes.data);

//automation
        const automationRes = await getAutomationById(id);
        const a: AutomationDTO = automationRes.data ?? automationRes; 
        setAutomation(a);
        setStatus((a.status as any) || (a.isActive ? "ACTIVE" : "PAUSED"));
//media
        const mediaList = await getIgMedia(10);
        mediaStore.setMedia(mediaList);
        if (a.mediaId) mediaStore.select(a.mediaId);

        // hydrate preview store from automation rule/actions
        const match = a.rule?.trigger?.match ?? {};
        const include = (match.include ?? match.contains ?? []) as string[];
        preview.setIncludeKeywords(include);

        const reply = a.rule.actions.find((x) => x.type === "comment_reply");
        preview.setReplyText(reply?.text ?? "");


        const dm = a.rule.actions.find((x) => x.type === "send_dm");
        preview.setDmText(dm?.text ?? "");
        const btn = dm?.buttons?.[0];
        preview.setButtonLabel(btn?.label ?? "");
        preview.setButtonUrl(btn?.url ?? "");

        // keep regex if present
        setRegex(match.regex ?? "");
      } catch (e) {
        console.error("Failed to load edit automation context", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [igUserId, id]);

  const canProceedToNext = useMemo(() => {
    switch (currentStep) {
      case 1:
        return Boolean(mediaStore.selectedMediaId);
      case 2:
        return preview.includeKeywords.length > 0;
      case 3:
        return campaignType === "comment-reply-dm"
          ? Boolean(preview.dmText || preview.buttonUrl || preview.buttonLabel)
          : true;
      default:
        return false;
    }
  }, [
    currentStep,
    mediaStore.selectedMediaId,
    preview.includeKeywords,
    preview.dmText,
    preview.buttonUrl,
    preview.buttonLabel,
    campaignType,
  ]);

  const canSubmit = useMemo(() => {
    return Boolean(
      igUserId &&
        mediaStore.selectedMediaId &&
        preview.replyText 
    );
  }, [
    igUserId,
    mediaStore.selectedMediaId,
    preview.replyText,
  ]);

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };


  const handleSave = async () => {
    if (!igUserId || !automation || !mediaStore.selectedMediaId) return;
    try {
      setSaving(true);

      
      let replyText =
        preview.replyText || "Automated reply";
      const actions: any[] = [];
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
      if (regex) match.regex = regex;

      const rule = {
        trigger: {
          type: "comment_created",
          mediaId: mediaStore.selectedMediaId,
          match: Object.keys(match).length ? match : undefined,
        },
        actions,
      };

      await updateAutomation(automation.id, {
        mediaId: mediaStore.selectedMediaId,
        campaignType,
        name: automation.name,
        rule,
      });

      alert("Automation updated");
    } catch (e) {
      preview.reset();
      useMediaSelection.getState().clear();
      console.error("Update failed", e);
      alert("Failed to update automation");
    } finally {
      preview.reset();
      const media = useMediaSelection.getState()
      media.clear();
      setSaving(false);
    }
  };
  const isActive = status === "ACTIVE";
  const handleToggleActive = async () => {
    if (!automation) return;
    try {
      setIsGoLiveLoading(true);
      const nextStatus: "ACTIVE" | "PAUSED" = status === "ACTIVE" ? "PAUSED" : "ACTIVE";
      const nextIsActive = nextStatus === "ACTIVE";
  
      const res = await updateAutomationStatus({status:nextStatus, isActive:nextIsActive},automation.id);
  
      
      const newStatus = res?.data?.status ?? res?.status ?? nextStatus;
      setStatus(newStatus);
    } catch (e) {
      console.error("Failed to update automation status", e);
      alert("Failed to update automation status");
    } finally {
      setIsGoLiveLoading(false);
    }
  };
  if (!igUserId) {
    return (
      <div className="flex h-screen bg-[#12111A] items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-white mb-2">
            No Instagram Account
          </div>
          <div className="text-white/60">
            Please connect your Instagram account first.
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#12111A] items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-white mb-2">
            Loading automation…
          </div>
          <div className="text-white/60">Please wait.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#12111A]">
      {/* Left panel */}
      <div className="w-80 border-r border-white/10 overflow-y-auto">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4 text-white" />
            <h1 className="text-lg font-semibold text-white">
              {campaignType === "comment-reply"
                ? "Edit Comment Reply"
                : "Edit Comment Reply + DM"}
            </h1>
            <Badge className={`text-xs ${status === "ACTIVE" ? "bg-green-500" : "bg-red-500"} text-white`}>
              {status === "ACTIVE" ? "Running" : "Stopped"}
            </Badge>
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

          <StepNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            canProceedToNext={canProceedToNext}
            canSubmit={canSubmit}
            isSaving={saving}
            automationId={automation?.id ?? null}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSave={handleSave}
          />

          <div className="pt-4 border-t border-white/10 mt-6 text-xs text-white/60">
            <div className="mb-1">Automation ID: {automation?.id}</div>
            <div>Media ID: {mediaStore.selectedMediaId || "—"}</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 relative">
        <div className="h-full mt-24">
          <PhoneMockup campaignType={campaignType} currentStep={currentStep} />
        </div>
      </div>
      {automation?.id && (
        <Button
          variant="outline"
          onClick={handleToggleActive}
          className="bg-violet-600 hover:bg-violet-700 text-white text-xs px-3 py-1"
          disabled={isGoLiveLoading}
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
      <MediaSelectionDialog
        open={showMediaModal}
        onOpenChange={setShowMediaModal}
      />
    </div>
  );
}
