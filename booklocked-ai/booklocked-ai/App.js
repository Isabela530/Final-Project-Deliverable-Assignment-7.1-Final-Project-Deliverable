// Book Tracker AI
// Final Project Submission
// Author: Isabela Teck
// Purpose: AI-powered reading tracker with progress, insights, and recommendations

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

/* ---------------- NAVIGATION ---------------- */
const Tab = createBottomTabNavigator();

/* ---------------- THEME ---------------- */
const theme = {
  gold: "#D4AF37",
  purple: "#6D28D9",
  dark: "#111827",
  card: "rgba(17,24,39,0.75)",
  white: "#FFFFFF"
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

/* ---------------- AI FUNCTIONS ---------------- */

// 🤖 Generative AI (simulated summary)
const generateAISummary = () => {
  return "AI Summary: This book explores key themes, character development, and important ideas based on reading progress and notes.";
};

// 🎯 Sentiment-based recommendation (simulated AI)
const getRecommendation = (mood) => {
  if (mood === "Happy") return "Try: Atomic Habits";
  if (mood === "Focused") return "Try: Deep Work";
  if (mood === "Tired") return "Try: Short Stories Collection";
  return "Try: The Alchemist";
};

/* ---------------- HOME SCREEN ---------------- */
function HomeScreen() {
  const { books, setBooks } = useContext(BookContext);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [notes, setNotes] = useState("");

  const [mood, setMood] = useState("Neutral");

  const [activeBook, setActiveBook] = useState(null);
  const [progressInput, setProgressInput] = useState("");

  const bgImage = require("./assets/booktracker.jpg");

  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "white",
    padding: 12,
    borderRadius: 12,
    marginTop: 10
  };

  /* ---------------- ADD BOOK (NLP DATA INPUT) ---------------- */
  const addBook = () => {
    if (!title) return;

    const newBook = {
      id: Date.now().toString(),
      title,
      author,
      notes, // NLP feature
      progress: 0,
      summary: "",
      completed: false
    };

    setBooks([...books, newBook]);

    setTitle("");
    setAuthor("");
    setNotes("");
  };

  /* ---------------- UPDATE PROGRESS ---------------- */
  const updateProgress = (id) => {
    setBooks(prev =>
      prev.map(b =>
        b.id === id
          ? {
              ...b,
              progress: Math.min(b.progress + 20, 100),
              completed: b.progress + 20 >= 100
            }
          : b
      )
    );
  };

  /* ---------------- AI SUMMARY ---------------- */
  const handleAISummary = (id) => {
    setBooks(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, summary: generateAISummary() }
          : b
      )
    );
  };

  return (
    <ImageBackground source={bgImage} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {/* HEADER */}
        <Text style={styles.header}>📚 Book Tracker AI</Text>

        {/* ADD BOOK SECTION */}
        <View style={styles.card}>
          <TextInput
            placeholder="Book Title"
            placeholderTextColor="#ccc"
            value={title}
            onChangeText={setTitle}
            style={inputStyle}
          />

          <TextInput
            placeholder="Author"
            placeholderTextColor="#ccc"
            value={author}
            onChangeText={setAuthor}
            style={inputStyle}
          />

          <TextInput
            placeholder="Book Notes (NLP input)"
            placeholderTextColor="#ccc"
            value={notes}
            onChangeText={setNotes}
            style={inputStyle}
          />

          <TouchableOpacity onPress={addBook} style={styles.button}>
            <Text style={{ color: "#fff" }}>Add Book</Text>
          </TouchableOpacity>
        </View>

        {/* MOOD TRACKING (SENTIMENT ANALYSIS) */}
        <View style={styles.card}>
          <Text style={{ color: "#fff", marginBottom: 10 }}>
            Mood: {mood}
          </Text>

          <View style={{ flexDirection: "row" }}>
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

            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={{ color: "#555" }}>{item.author}</Text>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View style={{
                width: `${item.progress}%`,
                height: 8,
                backgroundColor: theme.gold
              }} />
            </View>

            <Text>{item.progress}% complete</Text>

            {/* ACTIONS */}
            <View style={{ flexDirection: "row", marginTop: 10 }}>

              <TouchableOpacity onPress={() => updateProgress(item.id)}>
                <Text style={{ color: theme.purple, marginRight: 15 }}>
                  + Progress
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleAISummary(item.id)}>
                <Text style={{ color: theme.gold }}>
                  AI Summary
                </Text>
              </TouchableOpacity>
            </View>

            {/* SUMMARY OUTPUT (GEN AI) */}
            {item.summary !== "" && (
              <Text style={styles.summary}>
                {item.summary}
              </Text>
            )}

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

      <Text style={{ color: "#fff", fontSize: 18 }}>
        Books Completed: {completed}
      </Text>

      <Text style={{ color: theme.gold, marginTop: 10 }}>
        🔥 AI Insight: Keep reading daily to improve consistency!
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
  bookTitle: {
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