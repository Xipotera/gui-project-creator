
![](https://img.shields.io/npm/v/@xipotera/project-creator)
![](https://img.shields.io/npm/dm/@xipotera/project-creator) 
![](https://img.shields.io/github/issues/Xipotera/gui-project-creator)
![](https://img.shields.io/github/issues-closed/Xipotera/gui-project-creator?label=closed%20issues)
![](https://img.shields.io/github/stars/Xipotera/gui-project-creator?style=social)

## General information

***Currently only Gitlab is supported for storage repository.***

Small script to manage the rapid creation of a project from a template stored on a repository server ([Gitlab][1], [Github][2]) from the command line. Allows to configure several template models as well as several storage configuration on a repository server.


## Quick Features

-   Create several template configurations
-   Create several storage configurations
-   Automate repository creation and first 'Initial Commit' push


## News
-  Projects templates from **Github are now allowed**

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
        
-   Configure storage (add & delete)      
```
> project-start -c storage
```     
-   Configure template (add & delete)  
```
> project-start -c template
``` 

At least, one template must be configured for working!

#### Launch
    > project-start <PROJECT NAME>
    
    
    
[1]: <https://gitlab.com/>
[2]: <https://github.com/>
[3]: <https://www.npmjs.com/package/@xipotera/project-creator> "Link to @xipotera/project-creator"
