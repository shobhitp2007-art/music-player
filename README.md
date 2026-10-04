# 🎵 MusicFlow

### A Data Structures Based Web Music Player

MusicFlow is a browser-based music player developed using **HTML, CSS, and JavaScript**, with a strong focus on the practical implementation of **Data Structures**.

The project demonstrates how fundamental data structures can be used to build real features of a music application such as song searching, playlist navigation, and recently played history.

---

## 🚀 Features

- 🎵 Browse and search for songs
- ▶️ Play available song previews
- ⏮️ Previous and ⏭️ Next song navigation
- 🔀 Shuffle mode
- 🔁 Repeat mode
- 📋 Custom playlist
- 🕘 Recently played history
- 🔎 Fast exact song lookup
- 🎨 Professional MusicFlow-inspired album artwork
- 🌐 Live song data using the iTunes Search API
- 📱 Responsive and modern music-player interface

---

## 🧠 Data Structures Used

The main purpose of MusicFlow is to demonstrate the practical use of three custom data structures.

### 1. Hash Table

A custom Hash Table is implemented for song lookup and search.

**Used for:**
- Exact song-title lookup
- Song lookup by ID
- Artist + song search mapping

**Implementation:**

```javascript
const songTable = new HashTable(53);
```

The Hash Table uses buckets to handle multiple key-value pairs and a custom hash function.

**Average complexity:**
- Search: **O(1)**
- Insert: **O(1)** average

---

### 2. Circular Doubly Linked List

A custom Circular Doubly Linked List is used to manage the playlist.

Each node contains:

```text
Song
  ↓
Previous ← Current → Next
```

Because the list is circular:

```text
A ↔ B ↔ C
↑       ↓
└───────┘
```

**Used for:**
- Playlist management
- Next song
- Previous song
- Circular playlist navigation
- Removing songs

The implementation maintains:

```javascript
this.head
this.tail
this.current
this.size
```

**Complexity:**
- Next: **O(1)**
- Previous: **O(1)**
- Search within playlist: **O(n)**
- Removal: **O(n)**

---

### 3. Stack

A custom Stack is used to maintain the recently played songs.

The stack follows the **LIFO (Last In, First Out)** principle.

```text
Top
 ↓
Song C
Song B
Song A
```

Whenever a song is played, it is pushed onto the stack.

**Used for:**
- Recently Played History
- Maintaining newest songs first

**Complexity:**
- Push: **O(1)**
- Pop: **O(1)**
- Peek: **O(1)**

---

## 🏗️ Project Architecture

```text
                    MusicFlow
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   Hash Table     Circular DLL      Stack
        │              │              │
   Song Search      Playlist       History
        │              │              │
        └──────────────┼──────────────┘
                       │
                  Music Player
                       │
                HTML + CSS + JS
                       │
               iTunes Search API
```

---

## 🌐 API Integration

MusicFlow uses the **iTunes Search API** as its primary source for song data.

The application retrieves information such as:

- Song title
- Artist
- Album
- Album artwork
- Audio preview URL

The JavaScript configuration uses:

```javascript
const API_BASE =
    "https://itunes.apple.com/search";
```

The API is requested with:

```text
entity = song
media = music
country = IN
```

The project also includes a small offline fallback catalogue when the API is unavailable. 

---

## 📂 Project Structure

```text
MusicFlow/
│
├── index.html
├── styles.css
├── script.js
└── README.md
```

### `index.html`

Contains the structure of the application, including:

- Navigation
- Search interface
- Song cards
- Music player
- Playlist
- Recently played section

### `styles.css`

Contains the complete visual design of MusicFlow, including:

- Dark modern interface
- Cards
- Buttons
- Player controls
- Responsive layouts
- Animations and transitions

### `script.js`

Contains:

- Hash Table implementation
- Circular Doubly Linked List implementation
- Stack implementation
- API integration
- Song search
- Playlist operations
- Recently played history
- Music playback controls

---

## ▶️ How to Run

### 1. Clone the repository

```bash
git clone https://github.com/your-username/musicflow.git
```

### 2. Open the project

Open the project folder in **VS Code**.

### 3. Run the application

Open `index.html` in your browser.

For the best development experience, use the **Live Server** extension in VS Code.

---

## 🔍 How the Data Structures Work

### Searching for a song

When a user searches for an exact title:

```text
User Search
     ↓
Hash Table
     ↓
Exact Match
     ↓
Display Song
```

This demonstrates the practical use of a Hash Table for fast lookup.

### Playing the next song

When the user presses **Next**:

```text
Current Node
     ↓
current.next
     ↓
Next Song
```

Since the playlist is a Circular Doubly Linked List, navigation can continue from the last song back to the first.

### Recently played

When a song is played:

```text
Play Song
   ↓
Stack.push()
   ↓
Recently Played
```

The newest song appears at the top of the history.

---

## 🎯 Project Objectives

The main objectives of MusicFlow are:

1. To implement fundamental data structures from scratch.
2. To connect data structures with real-world application features.
3. To demonstrate the practical use of Hash Tables, Linked Lists, and Stacks.
4. To create a functional and visually appealing music-player interface.
5. To integrate live external data using an API.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | UI design and responsiveness |
| JavaScript | Application logic |
| iTunes Search API | Live song data |
| Hash Table | Song lookup |
| Circular Doubly Linked List | Playlist navigation |
| Stack | Recently played history |

---

## 📊 Complexity Summary

| Operation | Data Structure | Complexity |
|---|---|---|
| Exact song lookup | Hash Table | O(1) average |
| Insert song | Hash Table | O(1) average |
| Next song | Circular DLL | O(1) |
| Previous song | Circular DLL | O(1) |
| Playlist search | Circular DLL | O(n) |
| Playlist removal | Circular DLL | O(n) |
| Push history | Stack | O(1) |
| Pop history | Stack | O(1) |
| Peek history | Stack | O(1) |

---

## 🎓 Academic Relevance

MusicFlow is designed not only as a music player but also as a **Data Structures and Algorithms project**.

Instead of relying entirely on JavaScript's built-in collections for the core functionality, the project implements its own:

- Hash Table
- Circular Doubly Linked List
- Stack

This makes it possible to clearly demonstrate how data structures can be applied to a practical software application.

---

## 🔮 Future Improvements

Possible future improvements include:

- User accounts and authentication
- Persistent playlists using a database
- Full-length music streaming with a licensed music service
- Drag-and-drop playlist ordering
- Song recommendations
- Multiple playlists
- Cloud synchronization
- More advanced search and filtering

---



## ⭐ Conclusion

MusicFlow demonstrates how classical data structures can be integrated into a modern web application.

The project connects:

**Hash Table → Fast Search**

**Circular Doubly Linked List → Playlist Navigation**

**Stack → Recently Played History**

This combination makes MusicFlow both a functional music player and a practical demonstration of Data Structures in software development.
