--- 
layout: post
title: Sparklines
wordpress_id: 19
wordpress_url: http://www.beforeitwasround.com/2004/03/12/sparklines/
---
A few weeks ago, I attended Edward Tufte's course "<a href="http://www.edwardtufte.com/tufte/courses">Presenting Data and Information</a>."  Among the topics he covered were <a href="http://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0001Eb&topic_id=1&topic=Ask%20E.T">Sparklines</a>, which he defines as "small, high-resolution graphics embedded in a context of words, numbers, or [sic] images."

While they are without a doubt visually sexy, I'm not sure that I'm as enamored with them as he is.  Take for example, the baseball teams sparkline.  Season history in terms of binary wins and losses is displayed, as well as shutouts in red, and home games with a solid line.
<p class="centerPhoto"><img width="350" height="117" class="photo" alt="Edward Tufte's Sparklines Example" src="/_images/sparklines_1.gif" /></p>
While this is an elegant display of the information, I'm not convinced this is the right information.  For instance, why didn't he include winning percentage?  Or games back?  Why did he include margin of victory, but only include it for shutouts? Tufte does address the margin of victory question, commenting that the lines of the bars, could be longer or shorter based upon the runs for as opposed to runs against. But still, I'm stuck asking the question, what does this sparklines tell me that I didn't know already and really needed to?  The primary information I draw from this display is Wins vs. Losses and streaks (or trends).

Here I've developed what I consider to be a much more useful and informative display:
<p class="centerPhoto"><img width="411" height="119" class="photo" alt="My modifications to the Sparklines Example" src="/_images/sparklines_2.gif" /></p>
I added Winning Percentage and Games Behind as mentioned above.  I also added a date scale to the bottom, so that we can view W/L over time in addition to the sequential view (I know the numbers are off, I didn't feel like making them up).  I included a blue line to indicate the current date and in place of the unplayed games during the season a box indicating the upcoming games for each team.  There are lots of other potential uses for the "brown box": 7 day calendar view, last game stats, etc.  As the season continues the space will get smaller and smaller.  At some point it will be too small to have any utility.  I don't think my sparkline is perfect but I do believe it is an improvement.  At worst, I think I've followed Tufte's "do no harm" mantra.
