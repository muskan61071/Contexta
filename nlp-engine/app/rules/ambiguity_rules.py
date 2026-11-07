"""Patterns and vocabularies for the four ambiguity classes:
1. Unclear references
2. Words with more than one meaning
3. Sentences that can be grouped in different ways
4. Missing details
"""

KIND_UNCLEAR_REFERENCE = "Unclear reference"
KIND_MULTIPLE_MEANINGS = "Word with more than one meaning"
KIND_GROUPING_AMBIGUITY = "Sentence that can be grouped in different ways"
KIND_MISSING_DETAILS = "Missing details"

# Backward compatibility aliases
TELESCOPE_ATTACHMENT = r"\bwith\s+(?:a|an|the|my|her|his|their)?\s*([a-zA-Z-]+)"
BANK_SENSE = r"\bbank\b"

# 1. Common female and male names for pronoun gender disambiguation
FEMALE_NAMES = {
    "maya", "rina", "priya", "sarah", "emma", "olivia", "anna", "maria", "lisa", "elena",
    "claire", "sophia", "mia", "zoe", "chloe", "rachel", "jessica", "emily", "laura", "hannah"
}

MALE_NAMES = {
    "rahul", "arjun", "leo", "david", "sam", "alex", "john", "michael", "daniel", "james",
    "robert", "william", "joseph", "thomas", "charles", "chris", "brian", "kevin", "jason", "jordan"
}

# 2. Words with more than one meaning (Lexical ambiguity dictionary)
LEXICAL_AMBIGUITIES = {
    "bank": {
        "word": "bank",
        "senses": [
            {
                "label": "financial institution",
                "meaning": "a financial institution (for money, deposits, accounts)",
                "keywords": [
                    "deposit", "withdraw", "cheque", "check", "money", "account",
                    "cash", "loan", "atm", "balance", "transfer", "savings", "funds",
                    "financial", "teller", "credit", "finance", "invest"
                ],
                "rewrite": "the financial institution"
            },
            {
                "label": "land beside a river",
                "meaning": "the land beside a river or body of water",
                "keywords": [
                    "river", "water", "fishing", "shore", "stream", "walk",
                    "boat", "swimming", "lake", "grass", "creek", "dock", "fish", "picnic"
                ],
                "rewrite": "the riverbank"
            }
        ],
        "question": "Do you mean a financial institution or the land beside a river?"
    },
    "crane": {
        "word": "crane",
        "senses": [
            {
                "label": "construction machine",
                "meaning": "a tall machine used for lifting heavy objects on building sites",
                "keywords": [
                    "construction", "site", "lift", "hoist", "heavy", "building",
                    "steel", "cargo", "equipment", "contractor", "operator"
                ],
                "rewrite": "the construction crane"
            },
            {
                "label": "wading bird",
                "meaning": "a tall long-legged wading bird",
                "keywords": [
                    "bird", "wildlife", "feathers", "wetlands", "lake", "species",
                    "wings", "nest", "nature", "fly", "flock"
                ],
                "rewrite": "the wading bird"
            }
        ],
        "question": "Do you mean a construction lifting machine or a wading bird?"
    },
    "plant": {
        "word": "plant",
        "senses": [
            {
                "label": "manufacturing factory",
                "meaning": "an industrial manufacturing factory or facility",
                "keywords": [
                    "factory", "manufacturing", "machinery", "production", "industrial",
                    "workers", "power", "assembly", "facility", "shift"
                ],
                "rewrite": "the manufacturing factory"
            },
            {
                "label": "botanical plant",
                "meaning": "a living botanical organism or flora",
                "keywords": [
                    "garden", "leaves", "soil", "water", "botanical", "flowers",
                    "pot", "species", "green", "grow", "indoor", "nature"
                ],
                "rewrite": "the botanical plant"
            }
        ],
        "question": "Do you mean an industrial manufacturing factory or a botanical plant?"
    },
    "bat": {
        "word": "bat",
        "senses": [
            {
                "label": "sports bat",
                "meaning": "a wooden club used in sports like baseball or cricket",
                "keywords": [
                    "ball", "baseball", "cricket", "hit", "swing", "game", "match", "sport", "equipment"
                ],
                "rewrite": "the sports bat"
            },
            {
                "label": "flying mammal",
                "meaning": "a nocturnal flying mammal with wings",
                "keywords": [
                    "cave", "nocturnal", "animal", "fly", "mammal", "wings", "creature", "night"
                ],
                "rewrite": "the flying bat"
            }
        ],
        "question": "Do you mean a sports bat or a nocturnal flying mammal?"
    },
    "board": {
        "word": "board",
        "senses": [
            {
                "label": "board of directors",
                "meaning": "a governing committee of directors or trustees",
                "keywords": [
                    "directors", "committee", "meeting", "executive", "decision",
                    "governance", "members", "vote", "trustees", "chair"
                ],
                "rewrite": "the board of directors"
            },
            {
                "label": "wooden board",
                "meaning": "a physical wooden plank or display board",
                "keywords": [
                    "wood", "plank", "whiteboard", "chalkboard", "cut", "timber",
                    "nail", "wall", "write", "marker"
                ],
                "rewrite": "the wooden board"
            }
        ],
        "question": "Do you mean a governing board of directors or a physical wooden/display board?"
    },
    "letter": {
        "word": "letter",
        "senses": [
            {
                "label": "postal letter",
                "meaning": "a written postal message sent to someone",
                "keywords": [
                    "mail", "envelope", "stamp", "post", "postal", "sent", "address", "mailbox", "write"
                ],
                "rewrite": "the postal letter"
            },
            {
                "label": "alphabet character",
                "meaning": "a character or symbol of the alphabet",
                "keywords": [
                    "alphabet", "word", "spelling", "character", "uppercase", "lowercase", "font", "vowel", "consonant"
                ],
                "rewrite": "the alphabet character"
            }
        ],
        "question": "Do you mean a written mail letter or a character of the alphabet?"
    }
}

# 3. Structural / Syntactic Attachment Patterns
# Matches: transitive perception verb + object noun phrase + prepositional phrase "with [instrument/item]"
# Example: "I saw the teacher with binoculars" or "I saw the man with the telescope"
PP_ATTACHMENT_PATTERN = (
    r"\b(saw|seen|spotted|observed|watched|noticed|caught|photographed|followed|filmed|looked at)\b"
    r"\s+(?:the|a|an|my|our|their|that)?\s*([a-zA-Z-]+)\s+with\s+(?:a|an|the|my|her|his|their)?\s*([a-zA-Z-]+)"
)

# 4. Missing details patterns (Vague directives / Underspecified requests)
# Directives to move/reschedule an event without target time or date
EVENT_DIRECTIVE_PATTERN = (
    r"^\s*(?:please\s+)?(move|reschedule|postpone|shift|push back|delay|cancel)\s+(?:the\s+)?(meeting|call|sync|review|session|appointment|presentation|event)\b"
)

# Target time/date indicators that would resolve an event directive
TIME_DESTINATION_PATTERN = (
    r"\bto\s+(?:tomorrow|tonight|next\s+week|monday|tuesday|wednesday|thursday|friday|saturday|sunday|"
    r"\d{1,2}(?::\d{2})?\s*(?:am|pm)?|later|next\s+month|\w+\s+\d{1,2}(?:st|nd|rd|th)?)\b"
)

# Directives to send an unspecified item or send to an underspecified person
# Example: "Send it to Jordan" or "Forward it to Alex"
SEND_DIRECTIVE_PATTERN = (
    r"^\s*(?:please\s+)?(send|forward|share|email|give)\s+(it|this|that|them)\s+to\s+([A-Z][a-z]+)\b"
)
