import {
  ArrowLeft,
  Phone,
  Video,
  Camera,
  Mic,
  ImageIcon,
  CirclePlus,
} from "lucide-react";
import { useIgUser } from "@/stores/ig-user-store";
import Image from "next/image";
import { useAutomationPreview } from "@/stores/automation-preview";
export function DmSheet({ setDmsOpen }: { setDmsOpen: any }) {
  const user = useIgUser((s) => s.user);
  const preview = useAutomationPreview();
  const dmText = preview.dmText || "Check This Out !";
  const buttonLabel = preview.buttonLabel || "Learn More";
  const buttonUrl = preview.buttonUrl;
  return (
    <div className="h-full flex flex-col">
      <div className=" mt-2 flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeft size={20} onClick={() => setDmsOpen(false)} />
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gray-200">
              <Image
                src={user?.profilePictureUrl || "/placeholder.png"}
                alt="profile"
                width={26}
                height={26}
                unoptimized={true}
                referrerPolicy="no-referrer"
                className="rounded-full object-cover"
              />
            </div>
            <span>{user?.name || user?.username}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={20} />
          <Video size={20} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-6">
        <div className="h-16 w-16 rounded-full bg-gray-200">
          <Image
            src={user?.profilePictureUrl || "/placeholder.png"}
            alt="profile"
            width={64}
            height={64}
            unoptimized={true}
            referrerPolicy="no-referrer"
            className="rounded-full object-cover"
          />
        </div>
        <h1 className="text-lg font-bold">{user?.name}</h1>
      </div>

      <div className=" mt-4 flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex items-start gap-2">
        <div className="h-6 w-6 rounded-full bg-gray-200">
              <Image
                src={user?.profilePictureUrl || "/placeholder.png"}
                alt="profile"
                width={26}
                height={26}
                unoptimized={true}
                referrerPolicy="no-referrer"
                className="rounded-full object-cover"
              />
            </div>
  
           
            <div className=" flex flex-col space-y-2 bg-white/10 rounded-2xl px-3 py-2 max-w-[80%]">
              <div className="text-white/90"> {dmText}</div>

              {buttonUrl && (
                <div className="bg-white/20 text-center rounded-lg px-2 py-1 text-xs text-white">
                  {buttonLabel}
                </div>
              )}
            </div>
         
        </div>

        {/* <div className="flex justify-end">
            <div className="bg-blue-500 rounded-2xl px-3 py-2 max-w-[80%]">
              <div className="text-white"> You're welcome !</div>
            </div>
          </div>

          <div className="flex justify-end">
         
          </div> */}
      </div>
      <div className="absolute right-0 left-0 bottom-3 p-3">
        <div className="  flex flex-col   justify-center bg-slate-800 rounded-full p-2">
          <div className="flex items-center justify-between">
            <div className="bg-purple-400 rounded-full p-2">
              <Camera size={20} />
            </div>

            <div className="flex items-center gap-2">
              <Mic />
              <ImageIcon />
              <CirclePlus />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
