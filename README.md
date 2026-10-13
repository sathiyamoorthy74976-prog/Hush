# Hush

Chat first. Unblur later.

Anonymous campus chat with a Duolingo-style Spark meter. Strangers talk. The other person unblurs in five stages. Then both pick Match or Pass in private. Only a mutual Match keeps the chat.

Rename the product in `mobile/constants/app.ts`.

## Prototype (this build)

Interactive Expo flow at **390×844** (phone frame on web):

1. Onboarding (3 cards) → Sign up  
2. Home (streak, XP, 5 energy sparks, Go Live, QOTD, quests, league)  
3. Question of the Day  
4. Matching radar → Match found → Chat  
5. Tap the Spark meter (or send messages) to step Stages 1–5  
6. Decision → Waiting or Pass → Mutual chest → Session summary  
7. Chats with expiry timers, League, Friends/squads, Profile, streak widget  
8. Modals: chest, streak, out of energy  

No payments. Energy does not refill for money.

```bash
cd mobile
npm install
npx expo start
```

Web: open the framed phone. Phone: Expo Go.

```bash
cd ..
npm test
```
