import React from 'react';
import { Link } from 'react-router-dom';
import userNotesUnorganized from '../img/user_notes_unorganized.png';
import userNotesOrganized from '../img/user_notes_organized.png';
import publicNote from '../img/public_note.png';
import notesSearch from '../img/notes_search.png';

const homeNews = [
  {
    title: 'A small update',
    date: '05-28-21',
    loggedInOnly: true,
    content: (
      <>
        <p className="Module-paragraph">
          This site now has a discord server {' '}
          <a className="Askd-form-link" href="https://discord.gg/R66xRwH7N5"
             target="_blank" rel="noopener noreferrer">here</a>.
        </p>
        <p className="Module-paragraph">
          Hello again! I've been pretty lazy recently to be honest, feel kind of
          burned out. There haven't been very many changes to the site recently,
          but I guess I'll list a few.
        </p>
        <ol className="Cp-notes-home-post-list">
          <li>Added problems from Kattis, Yukicoder, and DMOJ</li>
          <li>Fixed the Codechef scraper</li>
          <li>Codeforces ratings will update automatically now</li>
          <li>Removed self from top contributors list</li>
          <li>This post will only show if you're logged in, which is cool I guess?</li>
        </ol>
        <p className="Module-paragraph">
          Here's a little life update though, if anyone cares :p The past few
          weeks have been a blur. After I stopped putting in as much time into
          this website, I've wasted a lot more time playing League and stuff like
          that. On the bright side though, that also means I've been finally
          spending some more time on Codeforces. I've been virtualing most days
          for the past few weeks, and might have felt a bit of improvement? idk.
        </p>
        <p className="Module-paragraph">
          I'm going to be interning in Seattle this summer, going to fly out in
          2 days... Didn't realize it was so soon until I wrote that sentence lol.
          I'm pretty excited to say the least. It'll be my first time living by
          myself in my own apartment, which is kind of sick. Gonna try to get
          super good at cooking :D I also will be going to my first ping pong
          tournament the day before I fly out. Hopefully I can achieve at least
          pupil rating. I'm really tired now, good night!
        </p>
      </>
    )
  },
  {
    title: 'Welcome!',
    date: '05-06-21',
    prodOnly: true,
    content: (
      <>
        <p className="Module-paragraph">
          Hello there, and welcome to cp-notes.com! Thanks for taking the time
          to visit! This site is intended to be a place for competitive
          programmers to share notes about their most interesting problems!
          Here's a list of some of the things you can do:
        </p>
        <div className="Cp-notes-home-post-image">
          <div className="Cp-notes-home-post-image-area">
            <div>
              <img src={userNotesUnorganized} alt="User profile, no organization" />
            </div>
            <div>
              <img src={userNotesOrganized} alt="User profile, organized by solved" />
            </div>
          </div>
          <p>
            Maintain an organizable profile of solved and unsolved problems
            from 6 different platforms
          </p>
        </div>
        <div className="Cp-notes-home-post-image">
          <div className="Cp-notes-home-post-image-area">
            <div>
              <img src={publicNote} alt="Published note page" />
            </div>
          </div>
          <p>Share notes with others and receive feedback</p>
        </div>
        <div className="Cp-notes-home-post-image">
          <div className="Cp-notes-home-post-image-area">
            <div>
              <img src={notesSearch} alt="Notes search page" />
            </div>
          </div>
          <p>Search and find notes written by other users</p>
        </div>
        <p className="Module-paragraph">
          As a side-effect of this project, I've also produced a rich
          text editor written in React, using HTML's <i>lovely</i> contenteditable.
          Definitely a little rough around the edges, but the inline math mode
          is quite unique from what I've seen - you can demo it
          {' '}
          <Link className="Askd-form-link" to="/demo">here</Link>!
        </p>
      </>
    )
  },
  {
    title: 'Welcome!',
    date: '04-16-21',
    betaOnly: true,
    content: (
      <>
        <p className="Module-paragraph">
          Hello there, and welcome to the beta site of
          {' '}
          <a className="Askd-form-link" href="https://cp-notes.com">
            cp-notes.com
          </a>!
          You've probably arrived here after looking at the name of the
          Github repository. This site is meant for me to test things without
          interfering with the production site. You can still make an account
          here and do all of the same things, but everything will be stored in
          databases separate from the production site, so you're not really
          supposed to use this. Why is it public, you might ask? I don't know,
          I think keeping it visible is kind of neat (and also results in less
          work for me).
        </p>
        <p className="Module-paragraph">
          Anyways, thanks for taking the time to visit! This site is intended
          to be a place for competitive programmers to share notes about their
          most interesting problems! Here's a list of some of the things you
          can do:
        </p>
        <div className="Cp-notes-home-post-image">
          <div className="Cp-notes-home-post-image-area">
            <div>
              <img src={userNotesUnorganized} alt="User profile, no organization" />
            </div>
            <div>
              <img src={userNotesOrganized} alt="User profile, organized by solved" />
            </div>
          </div>
          <p>
            Maintain an organizable profile of solved and unsolved problems
            from 6 different platforms
          </p>
        </div>
        <div className="Cp-notes-home-post-image">
          <div className="Cp-notes-home-post-image-area">
            <div>
              <img src={publicNote} alt="Published note page" />
            </div>
          </div>
          <p>Share notes with others and receive feedback</p>
        </div>
        <div className="Cp-notes-home-post-image">
          <div className="Cp-notes-home-post-image-area">
            <div>
              <img src={notesSearch} alt="Notes search page" />
            </div>
          </div>
          <p>Search and find notes written by other users</p>
        </div>
        <p className="Module-paragraph">
          As a side-effect of this project, I've also produced a rich
          text editor written in React, using HTML's <i>lovely</i> contenteditable.
          Definitely a little rough around the edges, but the inline math mode
          is quite unique from what I've seen - you can demo it
          {' '}
          <Link className="Askd-form-link" to="/demo">here</Link>!
        </p>
      </>
    )
  }
];

export default homeNews;
