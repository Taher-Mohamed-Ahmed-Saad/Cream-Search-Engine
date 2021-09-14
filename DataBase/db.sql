CREATE database searchengine;
USE searchengine;

CREATE TABLE Pages
(
    doc_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    link VARCHAR(1000) NOT NULL,
    des VARCHAR(2000),
    PRIMARY KEY (doc_id)
);



CREATE TABLE Word_idf
(
	wordss VARCHAR(100) NOT NULL,
    idf FLOAT NOT NULL,
    PRIMARY KEY (wordss)
);

CREATE TABLE Words
(
    word VARCHAR(100) NOT NULL,
    id INT NOT NULL,
    freq INT,
    tf FLOAT,
    PRIMARY KEY (word,id),
    FOREIGN KEY (id) REFERENCES Pages(doc_id) ON DELETE CASCADE ,
    FOREIGN KEY (word) REFERENCES Word_idf(wordss)  ON DELETE CASCADE
);

CREATE TABLE suggestions
(
	sugg_word VARCHAR(100) NOT NULL,
    PRIMARY KEY (sugg_word)
);
