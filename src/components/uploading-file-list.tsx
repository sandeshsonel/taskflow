import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  CheckCircle2, 
  X, 
  Trash2, 
  Info,
  Pause,
  Play
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Link } from "@tanstack/react-router";

interface UploadItemProps {
  fileName: string;
  fileSize: string;
  status: 'processing' | 'complete';
  thumbnailUrl: string;
  progress?: number;
  onDelete?: () => void;
  onCancel?: () => void;
  handleOpenVideoModel?: () => void
}

const UploadItem = ({ 
  fileName, 
  fileSize, 
  status, 
  thumbnailUrl, 
  progress = 0,
  onDelete,
  onCancel,
  handleOpenVideoModel
}: UploadItemProps) => {
  return (
    <Card className="flex flex-col sm:flex-row items-start sm:items-center w-full p-2">
      <CardContent className="p-0 flex flex-1 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          {/* Thumbnail */}
          <div 
          className="bg-center bg-no-repeat aspect-video bg-cover rounded-lg w-full sm:w-32 h-auto sm:h-20 bg-muted flex-shrink-0 relative cursor-pointer hover:opacity-90 transition-opacity group"
          style={{ backgroundImage: `url("${thumbnailUrl}")` }}
          aria-label={`Video thumbnail preview for ${fileName}. Click to play video.`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpenVideoModel?.()
            }
          }}
        >
          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <Play className="h-6 w-6 text-white fill-white" />
          </div>
        </div>
          
          {/* Content */}
          <div className="flex flex-1 flex-col justify-center w-full">
            <p className="text-sm font-medium leading-normal">{fileName}</p>
            
            <div className="flex items-center gap-2 mt-1">
              {status === 'processing' ? (
                <>
                  <Badge variant="secondary" className="text-xs">
                    Processing...
                  </Badge>
                  <span className="text-muted-foreground text-xs">· {fileSize}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 text-xs font-normal">Complete</span>
                  <span className="text-muted-foreground text-xs">· {fileSize}</span>
                </>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full mt-3">
              {status === 'processing' ? (
                <Progress value={progress} className="h-1.5" />
              ) : (
                <Progress value={100} className="h-1.5 bg-green-100" />
              )}
            </div>
          </div>
          
          {/* Action Button */}
         <div className="flex items-center space-x-1">
  <TooltipProvider>
    {/* Pause Button */}
    {status === 'processing' && (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            // onClick={onPause}
            className="shrink-0 h-8 w-8"
          >
            <Pause className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Pause</p>
        </TooltipContent>
      </Tooltip>
    )}

    {/* Cancel Button */}
    {status === 'processing' && (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="shrink-0 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Cancel</p>
        </TooltipContent>
      </Tooltip>
    )}

    {/* Delete Button */}
    {status !== 'processing' && (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="shrink-0 h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
    )}
  </TooltipProvider>
</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Usage example
export const UploadList = () => {
      const [isOpenVideoModal, setIsOpenVideoModal] = useState(false);


  const handleDelete = (fileName: string) => {
    console.log(`Delete ${fileName}`);
    // Add your delete logic here
  };

  const handleCancel = (fileName: string) => {
    console.log(`Cancel ${fileName}`);
    // Add your cancel logic here
  };

  const handleToggleVideoModal = () => {
    setIsOpenVideoModal(!isOpenVideoModal)
  }

  return (
    <>
    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 pt-5 border-b border-gray-200 dark:border-gray-700">
<h2 className="text-gray-900 dark:text-white font-bold leading-tight tracking-[-0.015em]">Uploading 3 files</h2>
<div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
    <Info size={14} />
<p className="text-xs font-normal">Videos will be automatically deleted after 24 hours.</p>
</div>
</div>
    <div className="space-y-4 mt-4 max-h-64 overflow-y-scroll overflow-x-hidden w-full">
      <UploadItem
        fileName="drone_footage_4k.mov"
        fileSize="1.2 GB"
        status="processing"
        thumbnailUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuD-1AtcbcyagyWkR1vPafg2hcaAuPVgMr54VdQDh2I9QKAgWioDaY9wQrfYbeJai5hRQpr75zW5wDdnVJGuXK_MYKQrnl6FSkw9TWUDNCcCneZfqCvYLMrr5uC6Ql-5NBohMaAtqu01xh--SWVxo9esQFakAtODetLfIEucoSBU0HY7-Xava7QnNBkhCRi1Q_ljMpFMQyR5qdLSCrIER5DmFduI4bNhYTI4XXe0xHgN_0_RJvI-TFyKa0b8GHacinzhmEVjqbPTcd8"
        progress={45}
        onCancel={() => handleCancel("drone_footage_4k.mov")}
        handleOpenVideoModel={handleToggleVideoModal}
      />
      
      <UploadItem
        fileName="product_demo_v2.mp4"
        fileSize="87.3 MB"
        status="complete"
        thumbnailUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBttnk68Xk_UyNUEkljMgIR1bczl0QHTheJ5ZwnM6PzANDXZDxBMZ9nOywbUQ3WsYl_46rfMt6wLTa1rM5MnwoJTA92UjruCXE2tnKS5008z5eUhoHcTnZTpa8PwN8oG3chLXRrfvmf9few8AOE6bfHqWnUCVBlA0sWbbvD0z2je1V8rKk90v-3LQEjn2lpCZjT4zc4auG7fNkhqA1PCJDEuchkWKXfizcMuj7DrGCRwQFKM4q00gC1mVIdvf5xyJ-DuWg3GCIayZQ"
        onDelete={() => handleDelete("product_demo_v2.mp4")}
        handleOpenVideoModel={handleToggleVideoModal}
      />
      
    </div>
    <Button className="flex items-end justify-end ml-auto mt-4">
    <Link to="/library">Go to Libary</Link>
    </Button>
    {isOpenVideoModal && (
          <Dialog open={isOpenVideoModal} onOpenChange={handleToggleVideoModal}>
      
      <DialogContent className="sm:max-w-4xl bg-black p-0 border-none">
        <div className="aspect-video w-full">
          <video 
            controls 
            autoPlay 
            className="w-full h-full rounded-lg"
            // poster={thumbnailUrl}
          >
            {/* <source src={videoUrl} type="video/mp4" /> */}
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  )
}
    </>
  );
};