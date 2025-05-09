
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Calendar, Clock, Search, Tag, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EmailCapture from '@/components/EmailCapture';
import { useToast } from '@/hooks/use-toast';

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
  {
    id: "4",
    slug: "measuring-phishing-readiness-metrics",
    title: "Measuring Your Organization's Phishing Readiness: Key Metrics",
    excerpt: "Learn how to effectively measure and improve your organization's resilience to phishing attacks using these key performance indicators and assessment tools.",
    date: "2025-03-28",
    author: {
      name: "Ellie Chambers",
      avatar: "https://i.pravatar.cc/300?img=45"
    },
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Analytics",
    tags: ["Metrics", "Measurement", "KPIs", "Security Posture"],
    readTime: "5 min"
  },
  {
    id: "5",
    slug: "building-human-firewall-security-culture",
    title: "Building a Human Firewall: Creating a Security-First Culture",
    excerpt: "Discover proven strategies for fostering a security-minded organizational culture where employees become your strongest defense against social engineering attacks.",
    date: "2025-03-20",
    author: {
      name: "Jamal Washington",
      avatar: "https://i.pravatar.cc/300?img=53"
    },
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Culture",
    tags: ["Culture", "Training", "Awareness", "Human Factors"],
    readTime: "8 min"
  }
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleSubscribe = (email: string) => {
    console.log("Blog subscription:", email);
    toast({
      title: "Successfully subscribed",
      description: "You'll receive our latest security insights directly in your inbox."
    });
  };

  const filteredPosts = searchTerm 
    ? blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : blogPosts;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Security Blog</h1>
              <p className="text-xl text-muted-foreground">
                Expert insights on phishing prevention, AI security, and keeping your organization safe.
              </p>
            </div>
            <div className="w-full md:w-72">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Featured post */}
          <div className="mb-16">
            <div className="relative rounded-xl overflow-hidden">
              <Link to={`/blog/${blogPosts[0].slug}`} className="group">
                <div className="aspect-video w-full">
                  <img 
                    src={blogPosts[0].image} 
                    alt={blogPosts[0].title} 
                    className="object-cover w-full h-full rounded-xl"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-8">
                  <div className="text-white">
                    <Badge variant="outline" className="bg-primary/70 text-white border-none mb-2">
                      Featured
                    </Badge>
                    <Badge variant="outline" className="bg-white/20 text-white border-none ml-2 mb-2">
                      {blogPosts[0].category}
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-primary-foreground transition-colors">
                      {blogPosts[0].title}
                    </h2>
                    <p className="line-clamp-2 md:line-clamp-3 text-muted/90 max-w-3xl mb-4">
                      {blogPosts[0].excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center">
                        <img 
                          src={blogPosts[0].author.avatar} 
                          alt={blogPosts[0].author.name} 
                          className="w-8 h-8 rounded-full mr-2 border-2 border-white/50"
                        />
                        <span>{blogPosts[0].author.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(blogPosts[0].date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{blogPosts[0].readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.slice(1).map((post) => (
                  <Link to={`/blog/${post.slug}`} key={post.id} className="group">
                    <div className="overflow-hidden rounded-lg border bg-card h-full flex flex-col">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {post.category}
                          </Badge>
                          {post.tags?.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                          <div className="flex items-center">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span>{post.author.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="rounded-lg border bg-card overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Subscribe to Security Updates</h3>
                  <EmailCapture 
                    title="Get Security Insights"
                    description="Join our newsletter for the latest phishing protection tips"
                    buttonText="Subscribe"
                    className="p-0 border-0 shadow-none bg-transparent"
                    onSuccess={handleSubscribe}
                  />
                </div>
              </div>
              
              <div className="rounded-lg border bg-card overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Categories</h3>
                  <div className="space-y-2">
                    {Array.from(new Set(blogPosts.map(post => post.category))).map(category => (
                      <div key={category} className="flex items-center justify-between group">
                        <span className="text-muted-foreground group-hover:text-primary flex items-center">
                          <Tag className="h-3 w-3 mr-2" />
                          {category}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {blogPosts.filter(post => post.category === category).length}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border bg-card overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(blogPosts.flatMap(post => post.tags || []))).map(tag => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
