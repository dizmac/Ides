# Ides
#### An open-source discord bot to view official Pinewood Builders events.
## Invite
https://discord.com/api/oauth2/authorize?client_id=841148794498580480&permissions=2147863616&scope=bot
## Changelogs
https://github.com/d-macks/Ides/blob/master/CHANGELOGS.md

## Usage

**Prefix**
> '**s!**'

### **notify**

**Aliases**
> ['**n**', '**notification**']

**Argument 1**
> Event ID (**Mandatory Argument**)


**Usage**
> s!notify **faf79920-136d-446c-a5d9-c40b6344b35b**  
> *Sets up a notification for event **faf79920-136d-446c-a5d9-c40b6344b35b***


### **viewblacklist**

**Aliases**
> ['**vb**', '**vblacklist**', '**bi**', '**binfo**', '**blacklistinfo**']

**Argument 1**
> User ID (Optional Argument, if not supplied, all the guild blacklist will be shown)


**Usage**
> s!viewblacklist   
> *Views the **Guild**'s blacklist*

> s!viewblacklist [**User ID**]  
> *Views the **User**'s blacklist information*



### **unblacklist**

**Aliases**
> ['**ub**', '**ublacklist**']

**Argument 1**
> User (**Mandatory Argument**)

**Usage**
> s!unblacklist [**Mentioned User**]  
> *Unblacklists the **Mentioned User***


### **blacklist**

**Aliases**
> ['**b**']

**Argument 1**
> User (**Mandatory Argument**)

**Argument 2**
> Reason (**Mandatory Argument**)

**Usage**
> s!blacklist [**Mentioned User**] Example reason   
> *Blacklists the **Mentioned User** with Example reason*

### **schedule**
**Aliases**  
> ['**s**']

**Argument 1**
> Division (**Mandatory Argument**)

**Argument 2**
> Filter/Events shown (Optional Argument, if not supplied, all the events will be shown)

**Usage**
> s!s PBST 5  
> *Shows **5** events from the security schedule*

> s!s TMS host=EnthusiasticKuba4007  
> *Shows **ALL** events hosted by EnthusiasticKuba4007 in the Syndicates Schedule*

### nextEvent
**Aliases**
> ['**ne**']

**Argument 1**
> Division (**Mandatory Argument**)
 
**Usage**
> s!ne PBST  
> *Shows **the next** event from the security schedule*

