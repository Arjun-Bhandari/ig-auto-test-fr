
import { useIgUser } from "@/stores/ig-user-store";
import { useMediaSelection } from "@/stores/media-selection";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import Image from "next/image"
export function PostSheet(){
    const { getSelectedMedia } = useMediaSelection();
  const selectedMedia = getSelectedMedia();
  const mediaUrl = selectedMedia?.media_url || "/placeholder.png";
  const user = useIgUser((s) => s.user);

    return(
     <>
        <h1 className="text-center text-lg">Posts</h1>
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gray-200">
              <Image
                src={user?.profilePictureUrl || "/placeholder.png"}
                alt="profile"
                width={24}
                height={24}
                unoptimized={true}
                referrerPolicy="no-referrer"
                className="rounded-full object-cover"
              />
            </div>
            <span>{user?.name}</span>
          </div>
          <h1 className="text-bold">...</h1>
        </div>
        <div className="mt-2 relative h-80">
          <Image
            src={mediaUrl}
            alt="post"
            fill
            unoptimized={true}
            referrerPolicy="no-referrer"
            className="rounded-sm  object-cover"
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-2 items-center">
            <Heart size={20} />
            <MessageCircle size={20} />
            <Send size={20} />
          </div>
          <Bookmark size={20} />
        </div>
      </>
    )
}