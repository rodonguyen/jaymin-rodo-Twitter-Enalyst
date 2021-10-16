# jaymin-rodo-CAB432-project

CAB432 Assignment 2 (Semester 2, 2021)

<br>

---

## **Progresses**

| Break |                    |                       |
| ----- | ------------------ | --------------------- |
| x     | Create Github repo | [Link](https://github.com/rodonguyen/jaymin-rodo-CAB432-project)
| x     | Discuss Idea       | Decided to do Twitter |

| Week 10 + 11 | (4-17 Oct)                           |     |
| ------------ | ------------------------------------ | --- |
| x            | Basic project idea: <br> - Purpose, description <br> - API use, use cases <br> - Outline desired architecture: Scaling and Persistence choice  |  Most parts are identical to Sheep's |
| x            | Allocate tasks | As discussed on the 9/10 meeting, each person is assigned with parts they're good at. Minh will handle more on Front-End side and coding. Rodo will contribute more on the report |
| x            | Research Architecture and draw one **(Both - Sat 9/10)** | Done in Proposal
| x            | Finish proposal **(Rodo Thursday night 7/10)** | 
| x            | Agree on the sprint plan    | OK
| x            | Choose weekly meeting time  | Sat 10.00-12.00
| x            | Get feedback from tutors    | We received some questions and new changes/developments to follow up in **week 12**


| Week 12 | (Starts on 18 Oct)      |     |
| ------- | ----------------------- | --- |
| .       | Discuss from tutor's feedback  |
| .       | Done 20% of the report (write down main points to understand the structure of the assignment and CRA/marks allocation) |
| .       | Project: 60% done, Basic features are operational  <br> Front-end  <br> Scaling is working but not required to be perfect  <br>  At least 1 persistence level |
| .       | Catch up with tutor for feedback/questions                               

| Week 13 | (Starts on 25 Oct)                        |     |
| ------- | ----------------------------------------- | --- |
| .       | Finish 80% of the report                  |
| .       | Project should be done and operational early in this week  |
| .       | Start to polish app                       |
| .       | Ask tutor for any last feedback           |

| Week 14 | (Starts on  1st Nov)              |     |
| ------- | --------------------------------- | --- |
| .       | Submit on Monday                  |
| .       | Do and finish presentation slides |
| .       | Practice presentation             |
| .       | Demo                              |


<br>
<br>

---

### Meeting notes 16/10/2021
Current progress:   
- Socket: server constantly query twitter post, analyze sentiment score and socket the result back to the client   
- Flow: search word - chart 1: give sentiment score for each post found, can add "View twitter post when hovering", chart 2: summary result from chart 1 result, chart 3: sentiment scores for the past time range of choice.  
- Trending: in progress

Questions / Action points:  
- Ask Huy / tutor:   
  - If using Twitter streaming: what does DB+Redis store
  - Architecture impact from using streaming or searching (Micheal)? - Rodo  
  - Scaling policy (Micheal)? - Trials and errors? 
- With the changes in features today, will it be 'enough load'? :  
    DB to store queried keyword results in the past. We add a new feature "Analysis of 1000 random posts for the past 24h/ 7 days", this feature utilizes the Search endpoint.    
    Redis to store results of searched words from clients on the instances
- Does Twitter Search have 'Time from ... to ...' parameter? - Rodo  
- Sentiment and Natural, NLTK functions difference? Research  
  


<br>