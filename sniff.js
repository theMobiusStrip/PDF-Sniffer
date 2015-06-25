/*
	Copyright (C) <2015>  <lindelof>
	
    This file is part of PDF Sniffer.

    DF Sniffer is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    DF Sniffer is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with PDF Sniffer.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
	Modify the following parameters if you would like to support more sites
*/
var params = 
[
	/* for Arxiv */
	[
	/arxiv\.org\/abs/gi, //target URL regex
	null, //pdf link id
	null,  //pdf link name
	/\/pdf\/[0-9]..*/g //pdf link regex
	],
	/* for Sciencedirect */
	[
	/sciencedirect\.com\.ezproxy\.lib\.purdue\.edu\/science\/article\/pii/gi,
	"pdfLink",
	null,
	null
	],
	/* for ACM */
	[
	/dl\.acm\.org\.ezproxy\.lib\.purdue\.edu\/citation\.cfm/gi,
	null,
	"FullTextPDF",
	null
	],
	/* for IEEE */
	[
	/ieeexplore\.ieee\.org\.ezproxy\.lib\.purdue\.edu\/xpl\/articleDetails\.jsp/gi,
	"full-text-pdf",
	null,
	null
	]
	/********************************
	Add paramters for new sites here
	*********************************/
];

var link = null;

function match_url(url, regex_url)
{
	if(url.match(regex_url) != null)
		return true;
	else
		return false;
}

function find_pdf_link(link_id, link_name, link_pdf_url)
{
	if(link_id != null)
	{
		var link = document.getElementById(link_id);
		return link;
	}else if(link_name != null)
	{
		var links = document.getElementsByName(link_name);
		return links[0];
	}else if(link_pdf_url != null)
	{
		var links = document.getElementsByTagName("a");
		if(links == null)
			return null;
			
		for(i = 0; i < links.length; i++)
		{
			var res = links[i].href.match(link_pdf_url);
			if(res != null)
					return links[i];
		}
		
		return null;
	}else
		return null;
}

var url = document.URL;	

for(var i = 0; i < params.length; i++)
{
	if(match_url(url, params[i][0]))
	{
		var pdflink = find_pdf_link(params[i][1], params[i][2], params[i][3]);
		if(pdflink != null)
			link = String(pdflink);
		break;
	}
}

//*************************************************
//
//Inject alert popup
//
//*************************************************

if(link != null)
{
	original_html = document.getElementsByTagName("body")[0].innerHTML;
	document.getElementsByTagName("body")[0].innerHTML = 
	'<div id="pdf_sniffer_bar" style="visibility: visible; position: fixed; top: 0;left: 0;z-index: 10;width: 100%; background-color: #067ab4;">'
	+ '<div style="text-align:left;color: white; margin: 5px 0px;">'
	+ '<img width="16" height="16" style="width: 16px; height: 16px; display: inline; margin: 0px 5px;" data-lpstyle="width:16px;height:16px;display:inline;" src="data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7">'
	+ 'PDF sniffer detects an academic pdf article. '
	+ '<img style="float:right; margin: 0px 5px;" width="25" height="25" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABX0lEQVR42qXTsWrCUBTGcaFroZNTwQfo1KnQN3CQblLIkD2CFIqbaEBQsGAIJBAaCIoQI4JKoeADFDpVmuCsUyE4FJyznJ4vSEjkKgWFH4R7cv/RS8zNZjORO/bMXDZkT+xWdO/hwtV+E02n0wxeg1d2eSxQYD+TyYRc1xXiGSIblhcFPnGT4zgnjUYjRBaHgaLneWSa5r+Mx2NE7tOBvmVZ1O12Y8vlkqIoovl8ToPBANdYS+a2bSPwkg58YNBsNhNBENB2uwVcZ2a9Xg+Bt0yg1WpRrVZLNBoNPBlwnZm1220E3tOBIQKKoiRWqxWFYRhbr9eZWafTQcBIBx4NwyBZlmO+79Nut8OTAd8Ca8kc54WDTwcu2He9XqdyuXySqqqEnyx6D27YLyKlUkkEB4jNISuIAnDNFpqmUaVSIUmSYtVqlXRdx2Z88uJXOeuBuexrr8+Kx/5MZ8kR0Vn+AGczfuZVuZDxAAAAAElFTkSuQmCC" id="lphideoverlay" data-lpstyle="width:16px;height:16px;float: right;" style="width: 16px; height: 16px; float: right;" onclick="popup_bar = document.getElementById(&quot;pdf_sniffer_bar&quot;); popup_bar.style.visibility=&quot;hidden&quot;;">'
	+ '<button style="float:right; margin: 0px 10px;" type="button" lptype="addsite" id="lpaddsite" class="lpbutton" value="Save Site" onclick="window.open(&quot;' + link +'&quot;)">Open article</button>'
	+ '</div>'
	+ '</div>' + original_html;
}