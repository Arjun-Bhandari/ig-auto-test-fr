import { useIgUser } from "@/stores/ig-user-store";
import { Separator } from "@/components/ui/separator";
import { useAutomationPreview } from "@/stores/automation-preview";
export function CommentSheet({commentsOpen}:{commentsOpen:boolean}){
    const user = useIgUser((s) => s.user);
    const preview = useAutomationPreview();
    const replyText = preview.replyText || preview?.responses[0] || "Thanks for your comment";
    return(
        <div
        className={[
          "absolute left-0 right-0 bottom-0",
          "mx-auto w-full",
          // slide up/down
          commentsOpen ? "translate-y-0" : "translate-y-full",
          "transition-transform duration-300 ease-out",
          "h-96 bg-[#1D1C23]",
        ].join(" ")}
      >
        <div className="rounded-t-xl  text-white ">
          {/* grab handle */}
          <div className="flex justify-center py-2">
            <div className="h-1.5 w-12 rounded-full bg-white/20" />
          </div>

          <div className="px-4 pb-3">
            <div className="text-center text-sm font-medium mb-3">
              Comments
            </div>
            <Separator />

            <div className="space-y-3 text-sm mt-2">
              <div className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-white/20" />
                <div>
                  <div className="font-medium">username</div>
                  <div className="text-white/80">
                    {preview.includeKeywords[0]} {preview.includeKeywords.length > 1 && `+${preview.includeKeywords.length - 1} more`}
                  </div>
                </div>
              </div>

              {/* brand reply preview (uses authenticated IG user) */}
              <div className="ml-8 flex items-start gap-2">
                <div className="h-5 w-6 rounded-full overflow-hidden bg-white/20">
                  <img
                    src={user?.profilePictureUrl || "/ig-logo.svg"}
                    alt={user?.name || "you"}
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <div className="font-medium">
                    {user?.name || "Your account"}
                  </div>
                  <div className="bg-white/10 rounded-2xl px-3 mt-2 py-2">
                  <div className="text-white/90">
                    {replyText}
                  </div>
                  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}