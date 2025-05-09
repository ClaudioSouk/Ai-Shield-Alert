
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, ChevronLeft, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import EmailCapture from '@/components/EmailCapture';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  image: string;
  category: string;
  tags: string[];
  readTime: string;
  content?: string;
}

// This is a placeholder. In a real app, these would come from an API or CMS
const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "ai-vs-phishing-how-hackers-are-using-gpt",
    title: "AI vs Phishing: How Hackers are Using GPT to Scale Attacks",
    excerpt: "Discover how cybercriminals are leveraging AI technologies like GPT to create more convincing and dangerous phishing attacks that bypass traditional security measures.",
    date: "2025-04-15",
    author: {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/300?img=32"
    },
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "AI Security",
    tags: ["AI", "Phishing", "GPT", "Cybersecurity"],
    readTime: "6 min",
    content: `
## The Rise of AI-Generated Phishing

In recent months, our security team has observed a significant shift in phishing tactics. Cybercriminals are now using large language models like GPT to automate and enhance their attacks in ways that were previously impossible.

### What Makes AI-Generated Attacks Different?

1. **Perfect grammar and spelling**: Gone are the days when you could spot a phishing email through obvious language errors.
2. **Personalization at scale**: Attackers can now generate thousands of unique, personalized messages.
3. **Context-aware content**: Today's AI can reference real events, company announcements, or industry news.
4. **Adaptable conversation flows**: Modern phishing can maintain convincing dialogue over multiple exchanges.

### Real-World Examples

We've collected several examples where AI-generated phishing emails successfully bypassed traditional security measures:

- A financial services firm received emails impersonating their CEO with specific references to an upcoming merger that had only been discussed internally.
- A manufacturing company's employees were targeted with sophisticated supply chain disruption messages that referenced actual suppliers and recent delivery schedules.

### Key Indicators

While AI makes phishing more sophisticated, there are still ways to detect these attacks:

- Unexpected urgency or pressure
- Requests that bypass normal procedures
- Links to domains that closely resemble but don't exactly match legitimate sites
- Requests for sensitive information or unusual access

### Protection Strategies

Organizations need to adapt their security posture to this new threat landscape:

1. Implement AI-powered email security that can detect AI-generated content
2. Conduct regular training with examples of advanced phishing techniques
3. Establish strict verification protocols for sensitive requests
4. Deploy multi-factor authentication across all systems

The arms race between security professionals and attackers has reached a new phase. As cybercriminals leverage AI for more sophisticated attacks, security teams must respond with equally advanced defenses.
    `
  },
  {
    id: "2",
    slug: "top-5-phishing-red-flags-to-train-your-team-on",
    title: "Top 5 Phishing Red Flags Every Employee Should Know",
    excerpt: "Learn the critical warning signs that your team should be aware of to identify and avoid sophisticated phishing attempts, including the latest AI-generated threats.",
    date: "2025-04-10",
    author: {
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/300?img=60"
    },
    image: "https://images.unsplash.com/photo-1588600878108-fa6350f6a122?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Training",
    tags: ["Training", "Awareness", "Security Culture", "Red Flags"],
    readTime: "4 min",
    content: `
## Why Traditional Phishing Training Falls Short

Traditional phishing awareness focuses on obvious signs like poor grammar and generic greetings. However, with AI-generated content becoming increasingly sophisticated, these indicators are no longer reliable.

### Red Flag #1: Manufactured Urgency

**What to watch for:** Messages that create artificial time pressure to force quick, thoughtless actions.

**Example:** "Your account will be terminated in 24 hours unless you verify your information immediately."

**Defense strategy:** Establish a verification protocol for urgent requests, such as calling the sender directly using a known phone number.

### Red Flag #2: Emotional Manipulation

**What to watch for:** Content designed to trigger strong emotional responses like fear, curiosity, or excitement.

**Example:** "Confidential information about tomorrow's layoffs has been shared with you."

**Defense strategy:** Teach employees to pause and assess their emotional reaction before taking action on any message.

### Red Flag #3: Credential Harvesting Attempts

**What to watch for:** Any unexpected request for login credentials, even on seemingly legitimate websites.

**Example:** "Your password has expired. Click here to reset it now."

**Defense strategy:** Always navigate directly to services through bookmarked URLs rather than clicking email links.

### Red Flag #4: Mismatched or Suspicious URLs

**What to watch for:** Links where the displayed text doesn't match the actual destination, or URLs with slight misspellings.

**Example:** A link showing "paypal.com" that actually points to "paypa1.com"

**Defense strategy:** Train employees to hover over links to view the true destination before clicking.

### Red Flag #5: Unexpected Attachments or Download Requests

**What to watch for:** Messages with unexpected attachments, especially with unusual file extensions.

**Example:** "Please review the attached invoice.zip file immediately."

**Defense strategy:** Verify the authenticity of any unexpected attachment with the sender through a separate channel.

Building a security-first culture requires ongoing education and reinforcement. By focusing on these sophisticated red flags rather than just traditional indicators, your team will be better prepared for today's AI-enhanced threats.
    `
  },
  {
    id: "3",
    slug: "phishing-examples-you-should-share-with-employees",
    title: "Real Phishing Examples You Should Share With Your Team",
    excerpt: "Real-world phishing examples that security professionals should use in training to help employees recognize increasingly sophisticated threats.",
    date: "2025-04-05",
    author: {
      name: "Alex Rivera",
      avatar: "https://i.pravatar.cc/300?img=49"
    },
    image: "https://images.unsplash.com/photo-1496096265110-f83ad7f96608?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Best Practices",
    tags: ["Examples", "Education", "Templates", "Training"],
    readTime: "7 min",
    content: `
## Learning From Real Attacks

The most effective way to prepare your team for phishing attacks is to show them real examples. Below, we've sanitized several sophisticated phishing attempts that successfully compromised organizations in 2025.

### Example 1: The "CEO Request" Email

**Subject:** Quick task - Please assist

**From:** Alex Thompson <alex.thompson@exampie.com> (note the "i" instead of "l")

**Body:**
\`\`\`
Hi [Employee Name],

I'm in a confidential meeting and need your quick assistance. We're about to close an unexpected deal and I need you to purchase some gift cards for the client team.

Could you buy 5 x $100 Amazon gift cards and send me the redemption codes as soon as possible? I'll approve the expense report when I'm back in the office tomorrow.

This is time-sensitive so please keep this between us for now.

Thanks,
Alex Thompson
CEO, Example Inc.
Sent from my iPhone
\`\`\`

**Why it works:** This example uses authority bias, urgency, and secrecy to bypass normal verification procedures. The forged sending address is barely distinguishable from the real domain.

### Example 2: The "IT Security Update" Message

**Subject:** Security Alert: Immediate Action Required

**From:** IT Security Team <security@microsoft-365security.com>

**Body:**
\`\`\`
SECURITY NOTIFICATION

Our systems have detected unusual sign-in activity to your Microsoft 365 account from [actual city where recipient is located] on [current date].

If this wasn't you, your account may be compromised. Click below to verify your identity and secure your account immediately:

[VERIFY ACCOUNT] 

If you don't verify within 24 hours, your account access will be suspended as a security measure.

IT Security Team
Microsoft 365
\`\`\`

**Why it works:** This uses legitimate-looking branding, actual location data (easily obtained from IP databases), and fear to drive quick action. The domain looks similar to official Microsoft domains but is actually controlled by attackers.

### Example 3: The "Invoice" Attack

**Subject:** Outstanding payment notification - Action needed

**From:** Accounting <accounting@legitimate-vendor-domain.com> (spoofed header)

**Body:**
\`\`\`
Dear [Actual recipient name],

Please find attached the outstanding invoice #INV-29581 for [actual service the company uses] due for payment.

This invoice is past due by 15 days. To avoid service interruptions, please process payment promptly.

Review the attachment for payment details.

Best regards,
[Actual accounting person's name from vendor]
Accounting Department
[Legitimate vendor name]
\`\`\`

**Attachment:** "Invoice-29581.doc" (contains malicious macro)

**Why it works:** This example uses accurate company relationships, correct contact names, and realistic business scenarios to appear legitimate. The Word document contains a malicious macro that installs malware when enabled.

### Training Recommendations

When sharing these examples with your team:

1. Highlight the specific red flags in each example
2. Show both the deceptive elements and the subtle clues that reveal the true nature
3. Provide clear guidance on the proper response to each type of attack
4. Consider running simulated phishing exercises using similar (but safe) examples

By studying real attacks, your team will develop the critical thinking skills needed to identify even the most sophisticated phishing attempts.
    `
  },
];

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    
    // In a real app, this would be an API call
    setIsLoading(true);
    
    setTimeout(() => {
      const foundPost = blogPosts.find(post => post.slug === slug);
      
      if (foundPost) {
        setPost(foundPost);
        
        // Find related posts by category or tags
        const related = blogPosts
          .filter(p => 
            p.id !== foundPost.id && 
            (p.category === foundPost.category || 
             p.tags?.some(tag => foundPost.tags?.includes(tag)))
          )
          .slice(0, 2);
          
        setRelatedPosts(related);
      }
      
      setIsLoading(false);
    }, 300);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-96 bg-muted rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">The blog post you're looking for does not exist or has been removed.</p>
            <Button onClick={() => navigate('/blog')}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <Button 
            variant="ghost" 
            className="mb-6 hover:bg-transparent hover:text-primary"
            onClick={() => navigate('/blog')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Badge className="mb-4">{post.category}</Badge>
              <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
                <div className="flex items-center">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name} 
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{post.readTime} read</span>
                </div>
              </div>
            </div>
            
            <div className="aspect-[16/9] mb-8 overflow-hidden rounded-xl">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="prose prose-slate max-w-none">
              {post.content && <ReactMarkdown>{post.content}</ReactMarkdown>}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-8">
              {post.tags?.map(tag => (
                <Badge key={tag} variant="outline">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
            
            <Separator className="my-12" />
            
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6">Subscribe for Security Updates</h3>
              <EmailCapture 
                title="Get Cybersecurity Alerts" 
                description="Stay informed about the latest phishing and social engineering threats"
              />
            </div>
            
            {relatedPosts.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedPosts.map(relatedPost => (
                    <Link to={`/blog/${relatedPost.slug}`} key={relatedPost.id} className="group">
                      <div className="overflow-hidden rounded-lg border bg-card">
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={relatedPost.image} 
                            alt={relatedPost.title}
                            className="object-cover w-full h-full transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="p-6">
                          <Badge variant="secondary" className="mb-2">
                            {relatedPost.category}
                          </Badge>
                          <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                            {relatedPost.title}
                          </h4>
                          <p className="text-muted-foreground line-clamp-2 mb-4">
                            {relatedPost.excerpt}
                          </p>
                          <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span>{relatedPost.author.name}</span>
                            <span>{relatedPost.readTime} read</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
