from stop_words import get_stop_words
from wordfreq import top_n_list
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Generate combined word list
stop_words = get_stop_words("english")
common_words = top_n_list("en", 300)
combined_words = list(set(stop_words + common_words))

# Create word bank
word_bank = (
    supabase.table("word_banks")
    .insert({"user_id": 9, "name": "Common Words", "is_selected": False})
    .execute()
)

word_bank_id = word_bank.data[0]["id"]

# Upload words to the words table
words_to_insert = [
    {"word_bank_id": word_bank_id, "word": word} for word in combined_words
]

result = supabase.table("words").insert(words_to_insert).execute()

print(f"Created word bank with ID: {word_bank_id}")
print(f"Inserted {len(result.data)} words into the words table")
