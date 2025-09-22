import { GoogleGenAI } from "@google/genai";
import type { Game } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

const GEMINI_API_KEY = "AIzaSyCHRR0Ez5SAt9Wp9gNB3mac_7vNVnP53Y8";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || "AIzaSyCHRR0Ez5SAt9Wp9gNB3mac_7vNVnP53Y8" });

interface PromptContext {
  type: "truth" | "dare";
  mode: "friends" | "crush" | "spouse";
  difficulty: "easy" | "medium" | "extreme";
  gameTheme: string;
}

interface GeneratedPrompt {
  text: string;
  isAIGenerated: boolean;
}

export class GeminiPromptGenerator {
  private static instance: GeminiPromptGenerator;
  private isGeminiAvailable: boolean;

  private constructor() {
    this.isGeminiAvailable = !!GEMINI_API_KEY;
  }

  static getInstance(): GeminiPromptGenerator {
    if (!GeminiPromptGenerator.instance) {
      GeminiPromptGenerator.instance = new GeminiPromptGenerator();
    }
    return GeminiPromptGenerator.instance;
  }

  async generatePrompt(context: PromptContext): Promise<GeneratedPrompt> {
    if (!this.isGeminiAvailable) {
      return this.getFallbackPrompt(context);
    }

    try {
      const prompt = this.buildGeminiPrompt(context);
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              prompt: { type: "string" },
              explanation: { type: "string" }
            },
            required: ["prompt"]
          }
        },
        contents: prompt,
      });

      const result = JSON.parse(response.text || "{}");
      
      if (result.prompt && typeof result.prompt === "string") {
        return {
          text: result.prompt,
          isAIGenerated: true
        };
      } else {
        console.warn("Invalid Gemini response format, falling back to static prompts");
        return this.getFallbackPrompt(context);
      }
    } catch (error) {
      console.error("Failed to generate prompt with Gemini:", error);
      return this.getFallbackPrompt(context);
    }
  }

  private buildGeminiPrompt(context: PromptContext): string {
    const { type, mode, difficulty, gameTheme } = context;

    const systemContext = `
You are creating ${type} prompts for a party game called "Game of Doom Truth or Dare".

GAME CONTEXT:
- Theme: ${gameTheme} (Dark party atmosphere, nightclub vibes, exciting and mysterious)
- Mode: ${mode} 
- Difficulty: ${difficulty}
- Type: ${type}

MODE GUIDELINES:
${this.getModeGuidelines(mode)}

DIFFICULTY GUIDELINES:
${this.getDifficultyGuidelines(difficulty)}

STYLE REQUIREMENTS:
- Use Gen Z slang and casual language (no cap, lowkey, highkey, sus, vibe, etc.)
- Keep prompts relatable and funny, not professional or formal
- Use modern references (TikTok, Instagram, dating apps, etc.)
- Make it feel like friends talking to friends
- Include internet culture and memes where appropriate
- Keep it spicy but not cringe

Generate exactly ONE ${type} prompt that fits these requirements. Return as JSON with "prompt" field.
`;

    return systemContext;
  }

  private getModeGuidelines(mode: string): string {
    switch (mode) {
      case "friends":
        return `
- Focus on friendship dynamics, shared experiences, and social bonds
- Questions about friend groups, loyalty, funny memories
- Dares involving group activities, social challenges, silly performances
- Keep content appropriate for close friendships
- Avoid romantic or intimate content`;
        
      case "crush":
        return `
- Focus on romantic interests, attraction, and dating
- Questions about crushes, dating experiences, romantic preferences
- Dares involving flirtation, romantic gestures, dating scenarios
- Include butterflies-in-stomach, first-date type content
- Keep romantic tension playful and exciting`;
        
      case "spouse":
        return `
- Focus on committed relationships, marriage, deep intimacy
- Questions about relationship dynamics, future plans, deep secrets
- Dares involving couple activities, romantic challenges, intimate gestures
- Include long-term relationship and marriage-oriented content
- Content can be more intimate and personal`;
        
      default:
        return "Focus on general social dynamics and party-appropriate content.";
    }
  }

  private getDifficultyGuidelines(difficulty: string): string {
    switch (difficulty) {
      case "easy":
        return `
- MILD CONTENT: Safe for all ages, work-appropriate topics
- Light-hearted, fun, and non-embarrassing
- Questions about preferences, favorites, light personal info
- Dares involving simple actions, silly performances, non-embarrassing tasks
- Nothing that could cause discomfort or judgment`;
        
      case "medium":
        return `
- MODERATE CONTENT: More adventurous, slightly embarrassing/risqué
- Can include mildly embarrassing stories, social media challenges
- Questions about awkward moments, minor secrets, dating stories  
- Dares involving social media posts, phone calls, public performances
- Content that might make someone blush but still party-appropriate`;
        
      case "extreme":
        return `
- BOLD CONTENT: Adult-oriented, very personal/intimate (18+)
- Can include deeply personal secrets, adult experiences, wild stories
- Questions about past relationships, adult decisions, controversial opinions
- Dares involving bold social actions, risky challenges, adult themes
- Content for mature audiences who have given explicit consent`;
        
      default:
        return "Keep content moderate and party-appropriate.";
    }
  }

  private getFallbackPrompt(context: PromptContext): GeneratedPrompt {
    // Gen Z style prompts that are relatable and fun
    const enhancedPrompts = {
      truth: {
        friends: {
          easy: [
            "What's the most unhinged thing you believed as a kid?",
            "Which friend here would definitely survive the apocalypse and why?",
            "What's your most cursed autocorrect moment?",
            "If you could only eat one food for life, what's your ride-or-die meal?",
            "What's the weirdest fever dream you've ever had?",
            "Who in this friend group has the most embarrassing tea about you?",
            "What's your most questionable Spotify Wrapped moment?",
            "Which friend here gives off main character energy?"
          ],
          medium: [
            "What's the most chaotic thing you did in school that still haunts you?",
            "Have you ever fake-liked something just to fit in? Spill the tea.",
            "What's your most cringe night out story that still makes you want to disappear?",
            "Have you ever had a crush on a friend's family member? Sus but we're listening.",
            "What secret are you lowkey keeping from your bestie right now?",
            "When did you last talk behind someone's back and immediately regret it?",
            "What's the most toxic friend behavior you've witnessed?",
            "Have you ever ghosted a friend? Why?"
          ],
          extreme: [
            "What's the most illegal thing you've done with this friend group? No cap.",
            "Have you ever hooked up with someone in this room? Don't lie.",
            "What's the biggest friendship betrayal you've experienced? Tell us everything.",
            "Have you ever stolen from a friend? We want details.",
            "What would make you instantly cut off a friend? What's your red line?",
            "Have you ever been secretly jealous of a friend's glow up or success?",
            "What's the most toxic thing you've done to a friend?",
            "Have you ever spread someone's business when you shouldn't have?"
          ]
        },
        crush: {
          easy: [
            "What's your dream first date vibe? Spill.",
            "What catches your attention first when someone's cute?",
            "Do you actually believe in love at first sight or nah?",
            "What personality trait makes you catch feelings instantly?",
            "What's the cutest way someone has ever tried to get your attention?",
            "Describe your most romantic daydream scenario.",
            "What's your biggest dating app ick?",
            "Would you rather slide into DMs or have someone slide into yours?"
          ],
          medium: [
            "What's the most cringe thing you've done trying to impress a crush?",
            "Ever caught feelings for someone way older or younger? How'd that go?",
            "What's the absolute worst pickup line someone tried on you?",
            "Have you ever pretended to be into something just to impress someone? What was it?",
            "Tell us about your most awkward dating app meetup.",
            "Ever been caught simping in public? What happened?",
            "What's your most embarrassing dating app profile moment?",
            "Have you ever stalked someone's socials before a date?"
          ],
          extreme: [
            "What's the most chaotic place you've hooked up? No judgment.",
            "Have you ever been in a love triangle? Spill the drama.",
            "What's the most scandalous thing on your dating history?",
            "Who's the most inappropriate person you've caught feelings for?",
            "Ever hooked up with your ex's friend? How messy did it get?",
            "What's something spicy you did that you lowkey regret?",
            "Have you ever been someone's side piece without knowing?",
            "What's the wildest dating app story you've never told anyone?"
          ]
        },
        spouse: {
          easy: [
            "What's one thing your partner does that still gives you butterflies?",
            "What was the moment you knew you wanted to spend your life together?",
            "What's your favorite memory from your wedding or proposal?",
            "What's something your partner taught you about love?",
            "What's the sweetest thing your partner has ever done?",
            "What do you love most about growing old together?"
          ],
          medium: [
            "What's something about your partner that annoyed you at first but now you love?",
            "Have you ever questioned your relationship during a big fight?",
            "What's your biggest fear about your marriage?",
            "What's something you wish you could change about your partner?",
            "Have you ever been tempted by someone else during your relationship?",
            "What's the biggest sacrifice you've made for your relationship?"
          ],
          extreme: [
            "What's your biggest regret in your marriage?",
            "Have you ever considered divorce seriously?",
            "What's something you've never told your partner?",
            "What's the closest you've come to being unfaithful?",
            "If you could relive your single days for one week, would you?",
            "What's the most hurtful thing your partner has ever said to you?"
          ]
        }
      },
      dare: {
        friends: {
          easy: [
            "Do your best impression of someone in this friend group!",
            "Sing happy birthday like you're a viral TikToker!",
            "Do 20 jumping jacks while reciting the alphabet backwards - no cap!",
            "Take the most unhinged selfie and show everyone!",
            "Give us your best main character dance for 30 seconds!",
            "Talk in a cursed accent for the next 3 rounds!",
            "Recreate your most embarrassing childhood photo pose!",
            "Do the cringiest dance trend you know!"
          ],
          medium: [
            "Call a pizza place and ask if they deliver to Mars!",
            "Post a throwback photo with the caption 'felt cute might delete later'!",
            "Let someone pick a contact and text them just 'bestie we need to talk'!",
            "Attempt a cartwheel or the most chaotic version of one!",
            "Wear something backwards for the rest of the game!",
            "Spill your most embarrassing childhood nickname and the full story behind it!",
            "Do your best influencer product pitch for something random in the room!",
            "Text your mom asking why she named you that!"
          ],
          extreme: [
            "Text your ex asking if they miss you (screenshot required)!",
            "Call your boss/teacher and tell them the worst dad joke ever!",
            "Post a video of you doing the worst dance ever on your story!",
            "Let the group write and post a chaotic social media post for you!",
            "Eat whatever cursed food combination the group creates!",
            "Call someone random from your contacts and catch up like besties!",
            "Post a thirst trap with the most unhinged caption!",
            "Text your crush something bold (group writes it)!"
          ]
        },
        crush: {
          easy: [
            "Show us how you'd slide into your dream crush's DMs!",
            "Do your most rizz-filled pickup line on someone imaginary!",
            "Demonstrate your flirting technique - make it obvious!",
            "Serenade an imaginary crush with the cheesiest love song!",
            "Act out your dream first kiss scenario (solo performance)!",
            "Do a main character slow dance by yourself!",
            "Show us your best 'notice me' pose for a photo!",
            "Practice asking someone out but make it smooth!"
          ],
          medium: [
            "Text your crush a genuine compliment (screenshot it)!",
            "Call someone cute and shoot your shot!",
            "Post a soft launch thirst trap on your story!",
            "Give us your best 'I'm that girl' dance for 30 seconds!",
            "Write and perform a love poem that doesn't completely suck!",
            "Show the group your kissing technique (use your hand, bestie)!",
            "Do a TikTok-style 'this is for my crush' video!",
            "Recreate the most romantic movie scene you know!"
          ],
          extreme: [
            "Send a risky but tasteful flirty message to someone in your phone!",
            "Call your ex and tell them one thing you actually miss!",
            "Post a thirst trap and leave it up for an hour (group approved caption)!",
            "Spill your wildest romantic fantasy to the group!",
            "Do a dramatic, over-the-top seductive dance (clothes stay on)!",
            "Kiss the most attractive person here (if everyone consents)!",
            "Text someone asking them on a date using the group's pickup line!",
            "Post 'looking for a bf/gf' on your story and leave it for 10 minutes!"
          ]
        },
        spouse: {
          easy: [
            "Recreate your first dance together!",
            "Tell everyone why you fell in love with your partner!",
            "Show us how you proposed or were proposed to!",
            "Do your partner's most annoying habit perfectly!",
            "Sing your wedding song together!",
            "Give your partner a 2-minute romantic massage!"
          ],
          medium: [
            "Tell everyone your partner's most embarrassing habit!",
            "Act out your worst fight in a comedic way!",
            "Reveal something your partner doesn't know you know about them!",
            "Do an impression of your partner when they're angry!",
            "Share a photo from your phone that your partner wouldn't want others to see!",
            "Tell everyone about your partner's worst cooking disaster!"
          ],
          extreme: [
            "Share your most intimate relationship secret!",
            "Tell everyone about the time you were most angry with your partner!",
            "Reveal something you've never told your partner but always wanted to!",
            "Describe your partner's most annoying bedroom habit!",
            "Tell everyone about a time you considered leaving your partner!",
            "Share the most embarrassing thing your partner has done in front of your family!"
          ]
        }
      }
    };

    const modePrompts = enhancedPrompts[context.type][context.mode];
    const difficultyPrompts = modePrompts[context.difficulty];
    const randomPrompt = difficultyPrompts[Math.floor(Math.random() * difficultyPrompts.length)];

    return {
      text: randomPrompt,
      isAIGenerated: false
    };
  }
}

export const promptGenerator = GeminiPromptGenerator.getInstance();