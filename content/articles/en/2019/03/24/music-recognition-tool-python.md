---
id: "0060"
title: "Building a Song Recognition App with Python: A Shazam-like Approach"
description: "Have you ever wondered how apps like Shazam can recognize songs just by listening to a snippet of audio? In this article, we'll explore how you can build your own song recognition app using Python.

..."
date: "2019-03-02"
categories: 
  - "Python"
tags: 
  - "librosa"
img: "blog/shazam.png"
cover: "blog/shazam.png"

language: "en"
alternates:
    - fr: ""
---

# Introduction
Have you ever wondered how apps like Shazam can recognize songs just by listening to a snippet of audio? In this article, we'll explore how you can build your own song recognition app using Python. I'll walk through the process of audio processing, feature matching, and retrieval, allowing you to identify the title and artist of a song based on an audio input.

# What is Shazam?
Before we dive deep into the article, let's be sure we are on the same page. Just incase you haven't heard of Shazam before, this section explains what it is.

Shazam is a mobile app that recognizes music around you. It is the best way to discover, explore and share new songs. Shazam connects more than 1 billion people. It is one of the most popular apps of all time, used by hundreds of millions of people each month to instantly identify music that’s playing and see what others are discovering. You can download the app on [Google Play](https://play.google.com/store/apps/details?id=com.shazam.android&hl=en) or [App Store](https://apps.apple.com/us/app/shazam/id284993459).

## How does Shazam work?
Shazam works by analyzing the captured sound and seeking a match based on an acoustic fingerprint in a database of more than 11 million songs. The app records a short snippet of the song and creates an acoustic fingerprint based on the audio. It then compares the fingerprint to the fingerprints of millions of songs in the database to find a match. If it finds a match, it returns information such as the artist, song title, and album.

# How to Build a Song Recognition App
Now back to the main topic of this article. In this section, we'll explore how to build a song recognition app using Python. We'll walk through the process of audio processing, feature matching, and retrieval, allowing you to identify the title and artist of a song based on an audio input. 

Let's break down the process into steps:
- Extracting the audio features from the song (Audio Processing)
- Creating a fingerprint of the audio (Creating a Database, and storing the fingerprint)
- Matching the fingerprint with the database 
- Retrieving the song information

## Extracting the audio features from the song
The first step in building a song recognition app is to extract the audio features from the song. We'll be using the [Librosa](https://librosa.org/doc/latest/index.html) library to extract the audio features. Librosa is a Python library for analyzing audio and music. It has a flatter package layout, standardizes interfaces and names, backwards compatibility, modular functions, and readable code.

To install Librosa, run the following command in your terminal:
```bash
pip install librosa
```

Now that we have Librosa installed, let's import it into our Python file and extract the audio features from the song. We'll be using the `load` function to load the audio file and the `feature` function to extract the audio features. 

```python
import librosa

# Audio Processing
def extract_features(audio_file):
    y, sr = librosa.load(audio_file)
    # Extract audio features like spectrogram or MFCCs
    features = librosa.feature.mfcc(y=y, sr=sr)
    return features

# Example usage
audio_file = "audio_sample.mp3"
features = extract_features(audio_file)
```

The `load` function returns two values: `y` and `sr`. `y` is a numpy array of the audio data and `sr` is the sampling rate of `y`. The sampling rate is the number of samples of audio carried per second, measured in Hz or kHz. The higher the sampling rate, the better the quality of the audio.


## Creating a Database, and storing the fingerprint
To recognize songs, we need a database of songs with their corresponding audio features and metadata. We can create this database by extracting features from a large collection of songs and storing them alongside their metadata, such as title and artist. It's essential to structure the database efficiently for quick and accurate matching.

Here's an example of how you can structure the database:

```python
database = [
    {"title": "Song 1", "artist": "Artist 1", "features": extract_features("song1.mp3")},
    {"title": "Song 2", "artist": "Artist 2", "features": extract_features("song2.mp3")},
    # Add more songs to the database
]
```

## Matching the fingerprint with the database
In this section, we'll focus on comparing the audio features of the input song with the features in our database. Techniques like fingerprinting or hashing are commonly used to efficiently match the input audio against the stored audio features. By comparing the features, we can find the closest match in our database.

Here's an example implementation using the fuzzywuzzy library for string matching:
```python
from fuzzywuzzy import fuzz

# Feature Matching
def find_matching_song(input_features):
    best_match = None
    best_score = 0
    for song in database:
        score = fuzz.token_set_ratio(song["features"], input_features)
        if score > best_score:
            best_match = song
            best_score = score
    return best_match

# Example usage
matching_song = find_matching_song(features)
```

## Retrieving the song information
Once we find a match, we can retrieve the corresponding metadata (title and artist) associated with the matched audio from our database. This step completes the song recognition process. If no match is found, we can handle it by returning an "Unknown Song" and "Unknown Artist" message.

Here's an example implementation:
```python
# Recognition and Retrieval
def recognize_song(audio_file):
    features = extract_features(audio_file)
    matching_song = find_matching_song(features)
    if matching_song:
        return matching_song["title"], matching_song["artist"]
    else:
        return "Unknown Song", "Unknown Artist"

# Example usage
audio_file = "audio_sample.mp3"
title, artist = recognize_song(audio_file)
```

## Conclusion
Building a song recognition app like Shazam using Python involves audio processing, database creation, feature matching, retrieval, and a well-designed user interface. The code snippets I have provided serves as a starting point, and you can tailor them to your specific requirements.
