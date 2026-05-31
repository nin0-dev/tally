CREATE TABLE users (id text primary key not null, pass text not null, name text not null, allow_transfer BOOLEAN DEFAULT FALSE);
CREATE TABLE decks (id text primary key not null, owner text not null, name text not null, content text);
CREATE TABLE plays (deck text not null, user text not null, last_played text, questions text);
