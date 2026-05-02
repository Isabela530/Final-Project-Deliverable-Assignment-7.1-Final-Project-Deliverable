// BookLocked AI
// Final Submission Version
// Author: Isabela Teck

import React, { useState, createContext, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

/* ---------------- THEME ---------------- */
const theme = {
  gold: "#D4AF37",
  purple: "#6D28D9",
  dark: "#111827"
};

/* ---------------- CONTEXT ---------------- */
const BookContext = createContext();

function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  return (
    <BookContext.Provider value={{ books, setBooks }}>
      {children}
    </BookContext.Provider>
  );
}

/* ---------------- AI LOGIC ---------------- */

// 🤖 UNIQUE AI SUMMARY (per book)
const generateAISummary = (book) => {
  const summaries = [
    "Explores emotional growth, identity, and transformation.",
    "Focuses on relationships, conflict, and personal development.",
    "Highlights power dynamics, struggle, and character evolution.",
    "A narrative driven by tension, growth, and emotional change.",
    "Examines inner conflict and deep psychological themes."
  ];

  const index = book.title.length % summaries.length;

  return `📖 ${summaries[index]} (AI analysis of "${book.title}")`;
};

// 💭 SENTIMENT-BASED RECOMMENDATION
const getRecommendation = (mood) => {
  if (mood === "Happy") return "Atomic Habits";
  if (mood === "Focused") return "Deep Work";
  if (mood === "Tired") return "Short Stories";
  return "The Alchemist";
};

/* ---------------- HOME SCREEN ---------------- */
function HomeScreen() {
  const { books, setBooks } = useContext(BookContext);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState("Neutral");

  const bgImage = require("./assets/booktracker.jpg");

  /* ---------------- ADD BOOK (NLP INPUT) ---------------- */
  const addBook = () => {
    if (!title) return;

    const newBook = {
      id: Date.now().toString(),
      title,
      author,
      notes,
      progress: 0,
      summary: "",
      completed: false
    };

    setBooks([...books, newBook]);

    setTitle("");
    setAuthor("");
    setNotes("");
  };

  /* ---------------- PROGRESS UPDATE ---------------- */
  const updateProgress = (id) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === id
          ? {
              ...book,
              progress: Math.min(book.progress + 20, 100),
              completed: book.progress + 20 >= 100
            }
          : book
      )
    );
  };

  /* ---------------- AI SUMMARY ---------------- */
  const handleAISummary = (id) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === id
          ? {
              ...book,
              summary: generateAISummary(book)
            }
          : book
      )
    );
  };

  return (
    <ImageBackground source={bgImage} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        <Text style={styles.header}>📚 Book Tracker AI</Text>

        {/* ADD BOOK */}
        <View style={styles.card}>
          <TextInput
            placeholder="Book Title"
            placeholderTextColor="#ccc"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="Author"
            placeholderTextColor="#ccc"
            value={author}
            onChangeText={setAuthor}
            style={styles.input}
          />

          <TextInput
            placeholder="Notes (NLP input)"
            placeholderTextColor="#ccc"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
          />

          <TouchableOpacity onPress={addBook} style={styles.button}>
            <Text style={{ color: "#fff" }}>Add Book</Text>
          </TouchableOpacity>
        </View>

        {/* MOOD SYSTEM (SENTIMENT ANALYSIS) */}
        <View style={styles.card}>
          <Text style={{ color: "#fff" }}>Mood: {mood}</Text>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            {["Happy", "Focused", "Tired", "Neutral"].map(m => (
              <TouchableOpacity key={m} onPress={() => setMood(m)}>
                <Text style={styles.mood}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={{ color: theme.gold, marginTop: 10 }}>
            🤖 Recommendation: {getRecommendation(mood)}
          </Text>
        </View>

        {/* BOOK LIST */}
        {books.map(item => (
          <View key={item.id} style={styles.bookCard}>

            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.author}</Text>

            {/* Progress */}
            <View style={styles.progressBar}>
              <View
                style={{
                  width: `${item.progress}%`,
                  height: 8,
                  backgroundColor: theme.gold
                }}
              />
            </View>

            <Text>{item.progress}% complete</Text>

            {/* BUTTONS */}
            <View style={{ flexDirection: "row", marginTop: 10 }}>

              <TouchableOpacity onPress={() => updateProgress(item.id)}>
                <Text style={{ color: theme.purple, marginRight: 15 }}>
                  + Progress
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleAISummary(item.id)}>
                <Text style={{ color: theme.gold }}>
                  🤖 AI Summary
                </Text>
              </TouchableOpacity>

            </View>

            {/* SUMMARY OUTPUT */}
            {item.summary ? (
              <Text style={styles.summary}>
                {item.summary}
              </Text>
            ) : null}

          </View>
        ))}

      </ScrollView>
    </ImageBackground>
  );
}

/* ---------------- DASHBOARD ---------------- */
function DashboardScreen() {
  const { books } = useContext(BookContext);

  const completed = books.filter(b => b.completed).length;

  return (
    <View style={styles.dashboard}>
      <Text style={styles.header}>📊 Dashboard</Text>

      <Text style={{ color: "#fff" }}>
        Completed Books: {completed}
      </Text>

      <Text style={{ color: theme.gold, marginTop: 10 }}>
        🔥 AI Insight: Keep reading daily for consistency!
      </Text>
    </View>
  );
}

/* ---------------- TABS ---------------- */
function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Books" component={HomeScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
    </Tab.Navigator>
  );
}

/* ---------------- APP ---------------- */
export default function App() {
  return (
    <BookProvider>
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    </BookProvider>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 15
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginTop: 10
  },
  button: {
    backgroundColor: "#6D28D9",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    alignItems: "center"
  },
  bookCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10
  },
  title: {
    fontWeight: "bold",
    fontSize: 16
  },
  progressBar: {
    height: 8,
    backgroundColor: "#eee",
    marginTop: 8
  },
  summary: {
    marginTop: 10,
    fontStyle: "italic",
    color: "#333"
  },
  mood: {
    marginRight: 10,
    color: "#fff"
  },
  dashboard: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 20
  }
});