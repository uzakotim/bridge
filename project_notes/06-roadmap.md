# 06-roadmap  
  
# Development Roadmap  
  
  
## Phase 1 - Prototype (2 weeks)  
  
Build:  
  
- authentication  
- profile  
- job input  
- AI skill extraction  
  
Goal:  
  
One user can get a skill report.   
  
---  
## Phase 1.5 - Database

- Make real authentication with convex auth and google signin, store authentication state, user's role, email, name 
- Save user data (name, email, role, etc.)   

## Phase 2 - Profile page 

Add:  
- Build profile page with skills list and target roles list
- Make input UI for user skills
- Save user skills in database from user input
- Create a list of target roles for user based on his skills using Gemini AI via a button
- Save this list in database
- Load this list when user open the profile page, if it was created before
- Make UI of profile page (the list of target roles) update based on this list

## Phase 3 - Skills gap report

- Generate a page for skills gap report similar to job-analyzer
- Use skills extractor from job analyzer and job description input
- Compare user skills (from profile) with target roles skills from the job description
- Show skills gaps with list of missing skills and skills level
- Save target role with the skill gaps and their levels in database

## Phase 4 - 

- Small projects generation based on skill gaps, based on selected target role, which is available from database

## Phase 5 - Job matching

Add:  
- job scraping  
- recommendations  
---  