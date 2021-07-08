# ccep-national-map

http://us.cidsitingtool.org/

A map showing the extent of CCEP's analysis for use on their own Squarespace site. The use case, is that the site will be hosted on Github pages and CID's home page can embed it with a `<iframe>`


## Development

Development of this website requires Python 2 or 3, simply to run a development web server so you can see your changes.

To start the web server, run either of the command below depending on your Python version, then open a web browser to http://localhost:8309/

```
# if you have Python 3
python3 -m http.server 8309

# if you have Python 2
python -m SimpleHTTPServer 8309
```

After the initial development, the majority of edits will probably be made to `constants.js` to change how states will be categorized and what colors are used.


## Setup and Configuration

All configuration and setup should be done in **constants.js** The settings are as follows:
* `FILLCOLOR_COMPLETED` `FILLCOLOR_INPROGRESS` and `FILLCOLOR_NOTANALYZED`  define the color given to each state, depending on its status.
  * These may be any HTML color code. All browser-supported color formats are suported: six-digit hex code with leading #, rgb() and rgba(), and well-known color names.
* `STATES_COMPLETED` `STATES_INPROGRESS` and `STATES_NOTANALYZED` define which states go into which category.
  * All states must be mentioned in one category. Any state not mentioned in any of these 3 categories, will be absent form the map.
  * It highly recommended to cut-and-paste a line from one category into the other, rather than manually typing them out, to ensure consistent spelling.
* `BORDERCOLOR` defines the color for state boundaries. All states have the same color boundary.
* `STATE_LABEL_STYLE` defines the style used for the state labels.
  * `color` defines the color of the text.
    * This may be any HTML color code. All browser-supported color formats are suported: six-digit hex code with leading #, rgb() and rgba(), and well-known color names.
    * The special color name `contrast` may be used to have the chart system automatically pick a color that contrasts well against the background.
  * `fontSize` defines the size of the text.
    * This may be specified in `pt` or `px` values, e.g. `12px` or `9pt`
  * `fontWeight` may be set to `bold` to use bold text. Any other value such as `regular` or `none` will be treated as regular, non-bold font.
  * `textOutline` defines an outline around the text.
    * This may be a pixel width and a color, e.g. `2px red`
    * The special color name `contrast` may be given, to have the chart automatically pick a color that contrasts nicely with the background and text colors.
    * This may be `none` to use no outline.
  * The built-in font is Lucida Grande / Lucida Sans, and it is not possible to change this.
  * For more details see https://api.highcharts.com/highcharts/plotOptions.series.dataLabels.style

You should have no need to edit **index.js** for normal usage. Still, some potential "exotic" modifications could include:
* If there comes a need to include _District of Columbia_, do a search for it in **index.js** and remove the 3 lines of `mapdata = mapdata.filter`
* The `statelabelpixelfuss` block specifies a set of shifts to the states' labels, to achieve some more balanced centering in a few edge cases. If necessary, you could add new lines here following the same `name/xfuss/yfuss` format. The values given are not in any specific unit, and you would need to just play with values a bit to see what works for you. Usual values are between -0.40 and +0.40

The map is written using the Highcharts Maps library. For more examples of these sorts of maps and documentation about them, refer to https://www.highcharts.com/demo/maps and https://api.highcharts.com/highmaps/


## Deploying to Github

To deploy the changes, make your edits  until your site looks right, then push the changes to the website. Then process would look something like this:

```
# review changed files or the specific changes, see if they look right
git status
git diff

# add and commit; use a brief but meaningful message about what you changed
git add .
git commit -m "made changes to the website"

# send it back to Github
git push
```
