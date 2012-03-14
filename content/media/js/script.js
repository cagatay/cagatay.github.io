/* Author:
*/
/**********************************************************

Javascript Pi Generator
Some portions (c) Copyright 1998 by Matthew Mastracci

Adapted from source by David H. Bailey by Matthew Mastracci
Email address: mmastrac@acs.ucalgary.ca

You may use this script wherever you wish, as long as this entire 
comment block stays intact.

Please send me any optimizations/improvements you make, as this
algorithm is currently quite slow.

Stuff to try:
 - Cache the intermediate "s" values in series() to speed up section
   generation.
 - Store some repeatedly used values in a table in the expm() function.
 - Automatically calculate the available precision available instead
   of assuming 11 digits

I'll be putting all my Javascript programs up on my website at:

http://web.archive.org/web/19990223205101/http://www.acs.ucalgary.ca//~mmastrac

You'll see them all first on Hotsyte (thanks, Jerry!):

http://web.archive.org/web/19990223205101/http://www.serve.com//hotsyte

************************************************************/

var tp = null;
var ntp = 25;

// optimum setting -- experiment if you want, but be sure to check
// for roundoff errors!
var precision = 11;   

function go(start)
{
  var nhx = 6;
  var chx = '';

  populate_table();

  var sc = parseInt(nhx / precision);

  for (var i = 0; i < sc; i++)
  {
    chx = chx + generate_section(start + i * precision, precision);
  }
  chx = chx + generate_section(start + i * precision, nhx - sc * precision);

  return chx;
  
}

function generate_section(ic, nhx)
{
  var pid, s1, s2, s3, s4;

  s1 = series(1, ic);
  s2 = series(4, ic);
  s3 = series(5, ic);
  s4 = series(6, ic);

  pid = 4.0 * s1 - 2.0 * s2 - s3 - s4;
  pid = pid - parseInt(pid) + 1.0;

  return ihex(pid, nhx);
}

function populate_table()
{
  tp = new Array();  

  tp[0] = 1.;
  for (i = 1; i < ntp; i++) 
    tp[i] = 2.0 * tp[i-1];  
}

function series(m, ic)
{
  var k;
  var ak, eps, p, s, t;

  s = 0.0;

  for (k = 0; k < ic; k++)
  {
    ak = 8 * k + m;
    p = ic - k;
    t = expm(p, ak);
    s = s + t / ak;
    s = s - parseInt(s);
  }

  for (k = ic; k <= ic + 100; k++)
  {
    ak = 8 * k + m;
    t = Math.pow(16.0, parseFloat(ic - k)) / ak;
    if (t < eps) break;
    s = s + t;
    s = s - parseInt(s);
  }

  return s;
}

function expm(p, ak)
{
  if (ak == 1.0) 
    return 0.0;

  var i, j;

  for (i = 0; i < ntp; i++) 
    if (tp[i] > p) break;

  pt = tp[i-1];
  p1 = p;
  r = 1.0;

  for (j = 1; j <= i; j++)
  {
    if (p1 >= pt)
    {
      r = 16.0 * r;
      r = r - parseInt(r / ak) * ak;
      p1 = p1 - pt;
    }
    pt = 0.5 * pt;
    if (pt >= 1.0)
    {
      r = r * r;
      r = r - parseInt(r / ak) * ak;
    }
  }

  return r;
}

function ihex(x, nhx)
{
  var y;
  hd = "0123456789ABCDEF";
  hx = new Array();
  for (i = 0; i < 16; i++)
  {
    hx[i] = hd.substring(i, i + 1);
  }

  chx = "";

  y = Math.abs(x);

  for (i = 0; i < nhx; i++)
  {
    y = 16.0 * (y - Math.floor(y));
    chx = chx + hx[parseInt(y)];
  }

  return chx;
}

var current_digit = 0;
var current_cell = 0;

setInterval(function () {
  var result = go(current_digit);
  var row = Math.floor(current_cell / 6);
  var cell = current_cell % 6;
  var el = document.getElementById('pi' + row + cell);
  el.style.backgroundColor = "#" + result;
  //el.innerHTML = result;
  current_digit += 6;
  current_cell = (current_cell == 35) ? 0 : (current_cell + 1);
}, 200);
