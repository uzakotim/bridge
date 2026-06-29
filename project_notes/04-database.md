# 04-database  
  
  
# Database Design  
  
  
## Users  
  
id  
email  
name  
created_at  
  
  
## UserSkills  
  
id  
user_id  
skill_name  
level  
  
  
## TargetRoles  
  
id  
name  
  
  
Example:  
  
Junior Robotics Engineer  
  
  
## Jobs  
  
id  
title  
company  
description  
  
  
## JobSkills  
  
id  
job_id  
skill_name  
importance  
  
  
## SkillGaps  
  
id  
user_id  
skill  
status  
  
Examples:  
  
missing  
learning  
completed  
  
  
## Roadmaps  
  
id  
user_id  
generated_plan  
