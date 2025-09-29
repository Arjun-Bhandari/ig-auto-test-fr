import { useEffect, useState } from "react";
import { IPhoneMockup , AndroidMockup} from "react-device-mockup";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { PostSheet } from "./instagramui/PostSheet";
import { CommentSheet } from "./instagramui/CommentSheet";
import { DmSheet } from "./instagramui/DmSheet";
import { PhoneHeader } from "./instagramui/Phone-Hearder";
interface PhoneMockupProps{
  campaignType?: string;
  currentStep?: number;
}
export function PhoneMockup({campaignType='comment-reply',currentStep=1}:PhoneMockupProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [dmsOpen, setDmsOpen] = useState(false);
  const showDmTab = campaignType === 'comment-reply-dm';
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'dms'>('posts');
  useEffect(() => {
    if (currentStep === 1) {
      setActiveTab('posts');
      setCommentsOpen(false);
      setDmsOpen(false);
    } else if (currentStep === 2 || currentStep === 3) {
      setActiveTab('comments');
      setCommentsOpen(true);
      setDmsOpen(false);
    } else if (currentStep === 4 && campaignType === 'comment-reply-dm') {
      setActiveTab('dms');
      setCommentsOpen(false);
      setDmsOpen(true);
    }
  }, [currentStep]);
  return (
    <div>
      <div className="flex h-full justify-center items-center">
        <AndroidMockup
          screenWidth={300}
          frameOnly={true}
          transparentNavBar
          hideStatusBar={true}
          frameColor="#252423"
        >
          <div className="relative w-full h-full">
            <div className="p-4 w-full">
              <PhoneHeader />
              {!dmsOpen ? <PostSheet /> : <DmSheet setDmsOpen={setDmsOpen} />}
            </div>
            {!dmsOpen && <CommentSheet commentsOpen={commentsOpen} />}
          </div>
        </AndroidMockup>
      </div>
      <div className="flex justify-center items-center mt-2 ">
        <Tabs defaultValue="posts" className="rounded-full">
          <TabsList className="rounded-full">
            <TabsTrigger
              value="posts"
              onClick={() => {
                setCommentsOpen(false);
                setDmsOpen(false);
              }}
              className="rounded-full"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              onClick={() => {
                setCommentsOpen(true);
                setDmsOpen(false);
              }}
              className="rounded-full"
            >
              Comments
            </TabsTrigger>
            {showDmTab && (
            <TabsTrigger
              value="dms"
              className="rounded-full"
              onClick={() => {
                setDmsOpen(true);
                setCommentsOpen(false);
              }}
            >
                Dm
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
