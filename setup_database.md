# Database Setup Instructions

## Step 1: Create Posts Table and Add Sample Data

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase_posts.sql` into the SQL editor
4. Click "Run" to execute the commands

This will:
- Create the `posts` table with proper structure
- Enable Row Level Security (RLS)
- Create appropriate policies for data access
- Add indexes for better performance
- Insert 10 sample blog posts with rich content

## Step 2: Verify the Setup

After running the SQL commands, you can verify the setup by:

1. Going to the "Table Editor" in your Supabase dashboard
2. Looking for the `posts` table
3. You should see 10 sample blog posts with titles like:
   - The Evolution of Generative Adversarial Networks: From GAN to StyleGAN-3
   - AI in 2025: Transforming Daily Life
   - The Rise of Multimodal AI Models: Bridging Text, Image, and Beyond
   - And 7 more articles

## Step 3: Test Your Blog

1. Restart your development server if it's running
2. Visit your blog at `http://localhost:3001`
3. Navigate to `/articles/` to see all the blog posts
4. Click on any article to view the full content with comments, bookmarks, and social sharing features

## Sample Blog Posts Included

The database now contains 10 comprehensive AI-related blog posts covering:

1. **GenAI**: The Evolution of Generative Adversarial Networks
2. **Future Tech**: AI in 2025: Transforming Daily Life
3. **AI Research**: The Rise of Multimodal AI Models
4. **3D Modeling**: Advancements in AI-Driven 3D Modeling
5. **Wearable Tech**: The Integration of AI in Wearable Technology
6. **Computer Vision**: Computer Vision in Autonomous Vehicles
7. **NLP**: Deep Learning for Natural Language Processing
8. **AI Ethics**: Ethical Considerations in Generative AI
9. **Future of AI**: The Future of AI Research: What's Next?

Each post includes:
- Rich HTML content with proper formatting
- Author information
- Category classification
- Featured images
- Proper timestamps

## Features Now Available

With the database populated, your blog now supports:

- ✅ Dynamic blog posts from database
- ✅ Comments system (for logged-in users)
- ✅ Bookmarking articles (for logged-in users)
- ✅ Social sharing functionality
- ✅ Reading time calculation
- ✅ Related posts based on categories
- ✅ Newsletter subscription
- ✅ Admin dashboard for managing posts
- ✅ Responsive design for all devices

Your AI blog site is now fully functional with real content! 