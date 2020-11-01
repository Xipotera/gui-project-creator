
  
![](https://img.shields.io/npm/v/@xipotera/project-creator)  
![](https://img.shields.io/npm/dm/@xipotera/project-creator)   
![](https://img.shields.io/github/issues/Xipotera/gui-project-creator)  
![](https://img.shields.io/github/issues-closed/Xipotera/gui-project-creator?label=closed%20issues)  
![](https://img.shields.io/github/stars/Xipotera/gui-project-creator?style=social)  
  
## General information  
  
Small script to manage the rapid creation of a project from a template stored on a repository server ([Gitlab][1], [Github][2]) from the command line. Allows to configure several template models as well as several storage configuration on a repository server.  
  
  
## Quick Features  
  
- Create several template configurations  
- Create several storage configurations  
- Automate repository creation and first 'Initial Commit' push  
  
  
## News  
- Storage repositories on **Github are now available**  
- Projects templates from **Github are now available**  
  
## Get started  
Learn how to use *Project Creator* and win productivity  
  
#### Installation  
The best way to use Project Creator is to install it globally through the [NPM package][3] (you can also use yarn).  
  
 > npm install -g @xipotera/project-creator  
#### Configuration  
  
  
You can change the script display title when execute the global configuration, and access to specific configuration (add & delete) for model storage repository or model templates projects   
  
``` 
> project-start -c  
```  

#### Where i can find my   `Private token access` :

##### `Github Server`:
- create it [on your Profile Settings](https://github.com/settings/tokens)
- needed scopes => _repo,  write:packages_

##### `Gitlab Server`,:
- create it [on your Profile Settings](https://gitlab.com/-/profile/personal_access_tokens)
- needed scopes => _api_

#### Configure storage server repository  
```
> project-start -c storage  
```   
#### Configure template project
At least, one template must be configured for working! 

```  
> project-start -c template  
```   
`NOTE`=> for the answer `Template Project Path repository` the expected entry was the path corresponding to `USER/REPOSITORY_NAME`.
 on `https://github.com/Xipotera/gui-project-creator` repository, the path was `Xipotera/gui-project-creator`
    
#### Launch  
```
 > project-start <PROJECT NAME>       
```
At each launch, the script memorizes the configuration choices of the created project.



[1]: <https://gitlab.com/>  
[2]: <https://github.com/>  
[3]: <https://www.npmjs.com/package/@xipotera/project-creator> "Link to @xipotera/project-creator"
