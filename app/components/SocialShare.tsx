"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Link as LinkIcon,
  Copy,
  Check
} from "lucide-react"

interface SocialShareProps {
  url: string
  title: string
  description?: string
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const shareData = {
    title,
    text: description || title,
    url,
  }

  const handleShare = async (platform: string) => {
    let shareUrl = ""
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case "native":
        if (navigator.share) {
          try {
            await navigator.share(shareData)
            return
          } catch (error) {
            console.log("Native sharing failed:", error)
          }
        }
        // Fallback to clipboard
        handleCopyLink()
        return
      case "clipboard":
        handleCopyLink()
        return
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: "Link copied",
        description: "Article link has been copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* Native Share (mobile) */}
      {typeof window !== 'undefined' && 'navigator' in window && 'share' in navigator && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("native")}
          className="h-8 px-3 border-gray-800 hover:bg-gray-900"
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      )}

      {/* Twitter */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter")}
        className="h-8 px-3 border-gray-800 hover:bg-gray-900"
      >
        <Twitter className="h-4 w-4 mr-1" />
        Twitter
      </Button>

      {/* Facebook */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("facebook")}
        className="h-8 px-3 border-gray-800 hover:bg-gray-900"
      >
        <Facebook className="h-4 w-4 mr-1" />
        Facebook
      </Button>

      {/* LinkedIn */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("linkedin")}
        className="h-8 px-3 border-gray-800 hover:bg-gray-900"
      >
        <Linkedin className="h-4 w-4 mr-1" />
        LinkedIn
      </Button>

      {/* Copy Link */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("clipboard")}
        className="h-8 px-3 border-gray-800 hover:bg-gray-900"
      >
        {copied ? (
          <Check className="h-4 w-4 mr-1 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 mr-1" />
        )}
        {copied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  )
} 