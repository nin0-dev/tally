CREATE TABLE IF NOT EXISTS users (id text primary key not null, pass text not null, name text not null);
CREATE TABLE IF NOT EXISTS decks (id text primary key not null, owner text not null, name text not null, content text);
CREATE TABLE IF NOT EXISTS plays (deck text not null, user text not null, last_played text, questions text);
