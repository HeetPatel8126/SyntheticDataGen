"""
Social Media Data Generator
Generates realistic social media posts, profiles, and engagement data
"""

import string
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Any, Optional
import random

from app.services.generators.base import BaseGenerator


PLATFORMS = ["Twitter/X", "Instagram", "Facebook", "LinkedIn", "TikTok", "YouTube", "Reddit", "Threads"]
PLATFORM_WEIGHTS = [20, 25, 15, 15, 10, 8, 5, 2]

POST_TYPES = ["Text", "Image", "Video", "Story", "Reel", "Carousel", "Poll", "Link", "Live"]

CONTENT_CATEGORIES = [
    "Technology", "Fashion", "Food & Cooking", "Travel", "Fitness & Health",
    "Business & Finance", "Entertainment", "Gaming", "Education", "News",
    "Art & Photography", "Sports", "Music", "Science", "Lifestyle",
    "Pets & Animals", "DIY & Crafts", "Comedy", "Politics", "Nature",
]

HASHTAG_POOLS = {
    "Technology": ["#tech", "#AI", "#coding", "#startup", "#innovation", "#programming", "#dataScience"],
    "Fashion": ["#fashion", "#style", "#ootd", "#streetwear", "#luxury", "#sustainable"],
    "Food & Cooking": ["#foodie", "#recipe", "#cooking", "#homemade", "#healthyeating", "#cheflife"],
    "Travel": ["#travel", "#wanderlust", "#explore", "#adventure", "#vacation", "#photography"],
    "Fitness & Health": ["#fitness", "#workout", "#gym", "#health", "#wellness", "#yoga"],
    "Business & Finance": ["#business", "#entrepreneur", "#marketing", "#investing", "#growth"],
    "Entertainment": ["#movies", "#music", "#tv", "#streaming", "#celebrity", "#pop"],
    "Gaming": ["#gaming", "#gamer", "#esports", "#twitch", "#pcgaming", "#ps5"],
}

SENTIMENTS = ["Positive", "Negative", "Neutral", "Mixed"]
SENTIMENT_WEIGHTS = [45, 15, 30, 10]

VERIFIED_RATE = 0.08  # 8% of accounts are verified

SAMPLE_BIOS = [
    "Digital creator | Coffee enthusiast",
    "Full-stack developer 💻 | Open source contributor",
    "Exploring the world one city at a time ✈️",
    "Sharing my fitness journey 💪",
    "CEO & Founder | Building the future",
    "Just a person who loves cats 🐱",
    "Photography | Nature | Adventure",
    "Student | Dreamer | Doer",
    "Content creator | 100K+ community",
    "Tech reviewer & gadget lover",
    "Mom of 3 | Recipe developer",
    "Data scientist by day, gamer by night",
]

ENGAGEMENT_TIERS = [
    {"name": "nano", "followers": (100, 1_000), "eng_rate": (3.0, 8.0)},
    {"name": "micro", "followers": (1_000, 10_000), "eng_rate": (2.0, 5.0)},
    {"name": "mid", "followers": (10_000, 100_000), "eng_rate": (1.0, 3.5)},
    {"name": "macro", "followers": (100_000, 1_000_000), "eng_rate": (0.5, 2.0)},
    {"name": "mega", "followers": (1_000_000, 50_000_000), "eng_rate": (0.2, 1.0)},
]
TIER_WEIGHTS = [35, 35, 20, 8, 2]

LANGUAGES = [
    {"code": "en", "name": "English", "weight": 50},
    {"code": "es", "name": "Spanish", "weight": 12},
    {"code": "pt", "name": "Portuguese", "weight": 8},
    {"code": "fr", "name": "French", "weight": 7},
    {"code": "de", "name": "German", "weight": 5},
    {"code": "ja", "name": "Japanese", "weight": 5},
    {"code": "hi", "name": "Hindi", "weight": 5},
    {"code": "ko", "name": "Korean", "weight": 4},
    {"code": "ar", "name": "Arabic", "weight": 4},
]


class SocialMediaGenerator(BaseGenerator):
    """
    Generator for social media data.
    Creates realistic social media posts, engagement metrics, and user profiles.
    """

    @property
    def name(self) -> str:
        return "social_media"

    @property
    def description(self) -> str:
        return "Social Media data including posts, engagement metrics, user profiles, hashtags, and content analytics"

    @property
    def fields(self) -> List[Dict[str, Any]]:
        return [
            {"name": "post_id", "type": "string", "description": "Unique post identifier", "example": "POST-A1B2C3D4"},
            {"name": "username", "type": "string", "description": "Author's username", "example": "@techguru42"},
            {"name": "display_name", "type": "string", "description": "Author's display name", "example": "Tech Guru"},
            {"name": "bio", "type": "string", "description": "Profile bio", "example": "Digital creator | Coffee enthusiast"},
            {"name": "is_verified", "type": "boolean", "description": "Whether account is verified", "example": False},
            {"name": "follower_count", "type": "integer", "description": "Number of followers", "example": 12500},
            {"name": "following_count", "type": "integer", "description": "Number of accounts following", "example": 890},
            {"name": "platform", "type": "string", "description": "Social media platform", "example": "Instagram"},
            {"name": "post_type", "type": "string", "description": "Type of post", "example": "Image"},
            {"name": "content_category", "type": "string", "description": "Content category", "example": "Technology"},
            {"name": "caption", "type": "string", "description": "Post caption/text", "example": "Excited to share my latest project!"},
            {"name": "hashtags", "type": "string", "description": "Hashtags used", "example": "#tech #coding #AI"},
            {"name": "likes", "type": "integer", "description": "Number of likes", "example": 342},
            {"name": "comments", "type": "integer", "description": "Number of comments", "example": 28},
            {"name": "shares", "type": "integer", "description": "Number of shares/retweets", "example": 15},
            {"name": "views", "type": "integer", "description": "Number of views/impressions", "example": 8500},
            {"name": "engagement_rate", "type": "float", "description": "Engagement rate percentage", "example": 3.2},
            {"name": "sentiment", "type": "string", "description": "Content sentiment", "example": "Positive"},
            {"name": "language", "type": "string", "description": "Content language", "example": "English"},
            {"name": "is_sponsored", "type": "boolean", "description": "Whether post is sponsored", "example": False},
            {"name": "media_url", "type": "string", "description": "Media URL (if applicable)", "example": "https://cdn.example.com/media/abc123.jpg"},
            {"name": "location", "type": "string", "description": "Tagged location", "example": "San Francisco, CA"},
            {"name": "device", "type": "string", "description": "Posting device", "example": "iPhone 15 Pro"},
            {"name": "posted_at", "type": "datetime", "description": "Post timestamp", "example": "2025-11-10T18:23:00"},
            {"name": "account_created", "type": "date", "description": "Account creation date", "example": "2020-03-15"},
        ]

    def _generate_caption(self, category: str) -> str:
        """Generate a realistic caption based on category."""
        templates = {
            "Technology": [
                "Just launched the beta version of my new app! 🚀",
                "AI is changing everything. Here's what I've learned this week.",
                "Spent the weekend building something cool with Python. Thread 🧵",
                "Hot take: the future of tech is open source.",
                "New blog post on scaling microservices is live!",
            ],
            "Food & Cooking": [
                "Made this from scratch and I'm proud 🍝",
                "Sunday brunch vibes 🥞☕",
                "Tried a new recipe and it turned out amazing!",
                "This restaurant has the best tacos I've ever had.",
                "Meal prep for the week ✅",
            ],
            "Fitness & Health": [
                "Morning run done! 5K in 24 minutes 🏃",
                "Consistency over perfection 💪",
                "New PR on deadlift today!",
                "Rest days are just as important as training days.",
                "30-day challenge complete! Here are my results.",
            ],
            "Travel": [
                "This view was worth the hike 🏔️",
                "Lost in the streets of a beautiful old city",
                "Bucket list destination ✅",
                "Nothing beats a sunset by the ocean 🌅",
                "Travel tips for first-time visitors — save this post!",
            ],
        }
        category_captions = templates.get(category, [
            f"Sharing some thoughts on {category.lower()} today!",
            f"New {category.lower()} content coming your way 🔥",
            f"What's your take on this? #{category.lower().replace(' ', '')}",
            f"Something I've been working on in the {category.lower()} space",
            "Check this out! Link in bio 👆",
        ])
        return random.choice(category_captions)

    def generate_record(self) -> Dict[str, Any]:
        """Generate a single social media post record."""
        # Profile
        first = self.faker.first_name()
        last = self.faker.last_name()
        display_name = f"{first} {last}"
        handle_base = f"{first.lower()}{last.lower()}"
        username = f"@{handle_base}{random.randint(1, 999)}"

        # Engagement tier
        tier = random.choices(ENGAGEMENT_TIERS, weights=TIER_WEIGHTS, k=1)[0]
        follower_count = random.randint(*tier["followers"])
        following_count = random.randint(
            max(10, follower_count // 20),
            max(50, follower_count // 2),
        )
        is_verified = random.random() < (VERIFIED_RATE * (5 if tier["name"] in ("macro", "mega") else 1))

        # Platform & post type
        platform = random.choices(PLATFORMS, weights=PLATFORM_WEIGHTS, k=1)[0]
        post_type = random.choice(POST_TYPES)
        category = random.choice(CONTENT_CATEGORIES)

        # Caption & hashtags
        caption = self._generate_caption(category)
        tag_pool_key = category if category in HASHTAG_POOLS else random.choice(list(HASHTAG_POOLS.keys()))
        tag_count = random.randint(1, 5)
        hashtags = " ".join(random.sample(HASHTAG_POOLS[tag_pool_key], min(tag_count, len(HASHTAG_POOLS[tag_pool_key]))))

        # Engagement metrics
        eng_rate = round(random.uniform(*tier["eng_rate"]), 2)
        views = random.randint(follower_count // 5, follower_count * 3)
        likes = int(views * eng_rate / 100 * random.uniform(0.6, 1.0))
        comments = int(likes * random.uniform(0.02, 0.15))
        shares = int(likes * random.uniform(0.01, 0.08))

        # Sentiment
        sentiment = random.choices(SENTIMENTS, weights=SENTIMENT_WEIGHTS, k=1)[0]

        # Language
        lang = random.choices(LANGUAGES, weights=[l["weight"] for l in LANGUAGES], k=1)[0]

        is_sponsored = random.random() < 0.07
        location = f"{self.faker.city()}, {self.faker.state_abbr()}" if random.random() < 0.4 else ""
        devices = ["iPhone 15 Pro", "iPhone 14", "Samsung Galaxy S24", "Pixel 8", "iPad Pro", "Web Browser", "Android"]
        device = random.choice(devices)

        posted_at = self.faker.date_time_between(start_date="-6m", end_date="now")
        account_created = self.faker.date_between(start_date="-10y", end_date="-6m")

        # Media URL
        media_ext = random.choice(["jpg", "png", "mp4", "webp"])
        media_url = f"https://cdn.example.com/media/{self._uuid4_hex()[:12]}.{media_ext}" if post_type != "Text" else ""

        return {
            "post_id": f"POST-{self._uuid4_hex()[:8].upper()}",
            "username": username,
            "display_name": display_name,
            "bio": random.choice(SAMPLE_BIOS),
            "is_verified": is_verified,
            "follower_count": follower_count,
            "following_count": following_count,
            "platform": platform,
            "post_type": post_type,
            "content_category": category,
            "caption": caption,
            "hashtags": hashtags,
            "likes": likes,
            "comments": comments,
            "shares": shares,
            "views": views,
            "engagement_rate": eng_rate,
            "sentiment": sentiment,
            "language": lang["name"],
            "is_sponsored": is_sponsored,
            "media_url": media_url,
            "location": location,
            "device": device,
            "posted_at": posted_at,
            "account_created": account_created.isoformat(),
        }
