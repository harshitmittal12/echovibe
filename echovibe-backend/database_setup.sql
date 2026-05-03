-- ================================================
-- EchoVibe: Complete Database Setup
-- Run this in phpMyAdmin → SQL tab on the 'echovibe' database
-- ================================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Songs table
CREATE TABLE IF NOT EXISTS songs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  mood VARCHAR(100) NOT NULL
);

-- 3. Listening history table
CREATE TABLE IF NOT EXISTS history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  song_name VARCHAR(255) NOT NULL,
  mood VARCHAR(100),
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Seed songs for every mood used in the frontend
--    Mood values MUST match the data-mood attributes in explore.html:
--    happy | sad | chill | romantic

INSERT IGNORE INTO songs (name, artist, mood) VALUES
-- Happy
('Kesariya',          'Arijit Singh',    'happy'),
('Levitating',        'Dua Lipa',        'happy'),
('Blinding Lights',   'The Weeknd',      'happy'),
('Happy',             'Pharrell Williams','happy'),
('Can\'t Stop the Feeling', 'Justin Timberlake', 'happy'),

-- Sad
('Someone Like You',  'Adele',           'sad'),
('Channa Mereya',     'Arijit Singh',    'sad'),
('Let Her Go',        'Passenger',       'sad'),
('The Night We Met',  'Lord Huron',      'sad'),
('Fix You',           'Coldplay',        'sad'),

-- Chill
('Sunflower',         'Post Malone',     'chill'),
('Night Changes',     'One Direction',   'chill'),
('Lofi Dreams',       'Chilled Cow',     'chill'),
('Sunset Lover',      'Petit Biscuit',   'chill'),
('retrograde',        'James Blake',     'chill'),

-- Romantic
('Perfect',           'Ed Sheeran',      'romantic'),
('Tum Hi Ho',         'Arijit Singh',    'romantic'),
('Until I Found You', 'Stephen Sanchez', 'romantic'),
('All of Me',         'John Legend',     'romantic'),
('Thousand Years',    'Christina Perri', 'romantic');
