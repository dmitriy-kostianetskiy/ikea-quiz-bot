//include jQuery on the page
//<script src="https://code.jquery.com/jquery-2.2.4.js"></script>



JSON.stringify($('div.product').map(function(i, product){

	product = $(product);

	var url = product.find('img.prodImg').attr('src');
	
	if (url.startsWith('http')){
		return;
	}
	
	var filename = url.replace(/^.*[\\\/]/, '');
	
	var name = product.find('.productTitle').text();
	var category = 'coffe tables';//product.find('.productDesp').text();
	
	if (url && name && category)
	{
		var item = { name: name, image: 'http://www.ikea.com/PIAimages/' + filename, category: category  };
		return item;
	}
	
	return;
})
.filter((a) => { return a }).toArray())
