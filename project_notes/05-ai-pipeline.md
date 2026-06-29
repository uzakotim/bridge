# 05-ai-pipeline   
  
  
# AI Pipeline  
  
  
## Step 1  
  
Extract skills from job descriptions  
  
  
Input:  
  
Raw job text  
  
  
Output JSON:  
  
  
{  
 "skills": [  
   {  
    "name":"Python",  
    "importance":9  
   }  
 ]  
}  
  
  
---  
  
## Step 2  
  
Analyze user profile  
  
  
Input:  
  
User skills  
  
Output:  
  
Skill confidence score  
  
  
---  
  
## Step 3  
  
Create roadmap  
  
  
Prompt:  
  
"You are a senior engineer.  
Create a 90 day plan  
for this candidate."  
  
  
Output:  
  
Learning tasks  
Projects  
Milestones  
  
  
---  
  
## Step 4  
  
Career Coach  
  
Chat interface:  
  
User:  
"What should I learn next?"  
  
AI:  
  
Based on your goals,  
learn Docker next because...  
