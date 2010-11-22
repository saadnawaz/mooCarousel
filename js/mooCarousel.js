// Distributed Under MIT licence, Copyright Rana Saad Nawaz
var mooCarousel = new Class({
		Implements: [Options, Events],
		elements: null,				
		leftTimes: 0,
		wid: 0,
		navigationImg: 50,
		slideProperty: 'margin-left',
		firstDirectionName: 'left',
		secondDirectionName: 'right',
		numberPrefix: null,
		options: {
			imagesPath: 'img/',
			elementClass: null,
			slideStep: 1,
			opacityLevel: 0.5,
			elementsPerScreen: 4,
			bgColor: 'gray',
			borderColor: 'black',
			borderWidth: 2,
			borderStyle: 'solid',
			imgPadding: 20,
			direction: 'horizontal',
			transitionEffect: Fx.Transitions.Bounce.easeOut,
			durationTime: 'normal',
			arrowColorScheme: 'blue'
		},		
    initialize: function(options){
			this.setOptions(options);
			this.numberPrefix = this.options.elementClass + Math.floor(Math.random()*100);
			this.elements = $$(this.options.elementClass);
			if(this.options.direction == 'horizontal'){
				this.wid = this.elements[0].width+parseInt(this.elements[0].getStyle('margin-right').replace("px",""))+parseInt(this.elements[0].getStyle('margin-left').replace("px",""));				
			}else{
				this.wid = this.elements[0].height+parseInt(this.elements[0].getStyle('margin-top').replace("px",""))+parseInt(this.elements[0].getStyle('margin-bottom').replace("px",""));
				this.slideProperty = 'margin-top';
				this.firstDirectionName = 'up';
				this.secondDirectionName = 'down';
				this.navigationImg = 0;
			}
			this.prepareArea();
			$(this.numberPrefix + 'el').set('tween', {link: 'chain', transition: this.options.transitionEffect, duration: this.options.durationTime});
			$(this.numberPrefix + 'el').addEvent('click:relay(img)', this.click.bind(this));
			$$(this.options.elementClass).morph({visibility: 'visible'});
		},		
		
		prepareLink: function(linkID, imgName){
			return nextAnchor = new Element('a', {
				id: this.numberPrefix + linkID,
				html: "<img src='"+this.options.imagesPath+imgName+"' height='40' width='40' />",
				styles: {
					color: 'black',
					cursor: 'pointer',
					verticalAlign: 'middle'
				}
			});
		},
		
		click: function(ev, imgObj){
			this.fireEvent('click', imgObj);
		},
				
		prepareArea: function(){
			var firstDiv = new Element('div', {id: this.numberPrefix + 'el'});
			var parent = this.elements[0].getParent();
			var total = 0;
			var max = 0;
			this.elements.each(function(el){
				if(this.options.direction == 'horizontal'){
					total += parseInt(el.width) + this.options.imgPadding;
					max = Math.max(max, el.height);					
					el.setStyle('margin-right', this.options.imgPadding);
				}else{
					total += parseInt(el.height) + this.options.imgPadding;
					max = Math.max(max, el.width);
					el.setStyle('margin-bottom', this.options.imgPadding);
				}
				el.inject(firstDiv, 'bottom');
			}.bind(this));
			
			var secondDiv = new Element('div', {
				styles: {position: 'absolute'}
			});
			
			if(this.options.direction == 'horizontal'){
				secondDiv.setStyle('width', total);
			}else{
				secondDiv.setStyle('height', total);
			}
			
			firstDiv.inject(secondDiv);
			
			var secondLink = this.prepareLink('slideAhead', this.secondDirectionName + "-" + this.options.arrowColorScheme + ".png");
			var that = this;
			secondLink.addEvents({
				click: function(){this.moveSlideRight();}.bind(that)
			});
			
			var firstLink = this.prepareLink('slideBack', this.firstDirectionName + "-" + this.options.arrowColorScheme + ".png");
			
			firstLink.addEvents({
				click: function(){this.moveSlideLeft();}.bind(that)
			});
			
			var leftDiv = new Element('div', {styles: {float: 'left', textAlign: 'center', backgroundColor: this.options.bgColor}});
			firstLink.inject(leftDiv);			
			
			var rightDiv = new Element('div', {styles: {float: 'left', textAlign: 'center', backgroundColor: this.options.bgColor}});
			
			secondLink.inject(rightDiv);
			var divPading = 20;
			if(Browser.ie)
				divPading = 20;
			var thirdDiv = new Element('div',{
				styles: {
					overflow: 'hidden',
					float: 'left',
					position: 'relative',
					marginRight: '10px',
					backgroundColor: this.options.bgColor,
					padding: divPading
				}
			});			

			secondDiv.inject(thirdDiv);	
			if(this.options.direction == 'horizontal'){
				if(!Browser.ie){
						thirdDiv.setStyles({width: (this.wid+this.options.imgPadding)*this.options.elementsPerScreen-this.options.imgPadding, height: max});
				}else
					thirdDiv.setStyles({width: (this.wid+this.options.imgPadding)*this.options.elementsPerScreen, height: max+2*divPading});
			}else{
				if(!Browser.ie)
					thirdDiv.setStyles({height: (this.wid+this.options.imgPadding)*this.options.elementsPerScreen-this.options.imgPadding, width: max});
				else
					thirdDiv.setStyles({height: (this.wid+this.options.imgPadding)*this.options.elementsPerScreen+this.options.imgPadding, width: max+this.options.imgPadding});
			}
					
			
			var outmostDiv = new Element('div', {id: 'outmostwrapper'})
			
			leftDiv.inject(outmostDiv, 'top');
			thirdDiv.inject(outmostDiv, 'bottom');
			rightDiv.inject(outmostDiv, 'bottom');
			outmostDiv.inject(parent);

			outmostDiv.setStyles({width: parseInt(thirdDiv.getStyle('width').replace("px", "")) + 2*divPading + this.navigationImg*2, height: parseInt(thirdDiv.getStyle('height').replace("px", ""))+2*divPading + "px",backgroundColor: this.options.bgColor});
			
			(new Element('div', {html: '', styles: {clear: 'both', display: 'block'}})).inject(firstDiv, 'bottom');

			if(this.options.direction == 'horizontal'){
				if(!Browser.ie){
					leftDiv.setStyles({paddingTop: (parseInt(thirdDiv.getStyle('height').replace("px", "")))/2, paddingBottom:(parseInt(thirdDiv.getStyle('height').replace("px", ""))-2*divPading)/2, width: 40, paddingLeft: '5px'});
					rightDiv.setStyles({paddingTop: (parseInt(thirdDiv.getStyle('height').replace("px", "")))/2, paddingBottom:(parseInt(thirdDiv.getStyle('height').replace("px", ""))-2*divPading)/2, width: 40, paddingRight: '5px'});
				}else{
					leftDiv.setStyles({paddingTop: (parseInt(thirdDiv.getStyle('height').replace("px", "")))/3, paddingBottom:(parseInt(thirdDiv.getStyle('height').replace("px", "")))/3, width: 40, paddingLeft: '5px'});
					rightDiv.setStyles({paddingTop: (parseInt(thirdDiv.getStyle('height').replace("px", "")))/3, paddingBottom:(parseInt(thirdDiv.getStyle('height').replace("px", "")))/3, width: 40, paddingRight: '5px'});
					outmostDiv.setStyles({width: parseInt(thirdDiv.getStyle('width').replace("px", "")) + this.navigationImg*2, height: parseInt(thirdDiv.getStyle('height').replace("px", ""))+ "px"});
				}
			}else{
					thirdDiv.setStyles({float: ''});			
					leftDiv.setStyles({float: '', height: 40, width: max+2*this.options.imgPadding, paddingTop: '5px'});
					rightDiv.setStyles({float: '', height: 40, width: max+2*this.options.imgPadding, paddingBottom: '5px'});
					outmostDiv.setStyles({height: parseInt(thirdDiv.getStyle('height').replace("px", ""))+2*divPading + 80});
					if(Browser.ie){
						outmostDiv.setStyles({width: parseInt(thirdDiv.getStyle('width').replace("px", "")) + this.navigationImg*2});
					}
			}
			
			if(Browser.opera && this.options.direction == 'vertical'){
				operaWrapper = new Element('div', {styles: {overflow: 'hidden'}});
				outmostDiv.inject(operaWrapper);
				operaWrapper.inject(parent);
			}
		},
				
		moveSlideLeft: function(){
			if(this.leftTimes*this.options.slideStep >= (this.elements.length-this.options.elementsPerScreen))
				return false;
			this.leftTimes++;
			$(this.numberPrefix+'el').tween('opacity', this.options.opacityLevel).tween(this.slideProperty, -(this.wid+this.options.imgPadding)*this.options.slideStep*this.leftTimes).tween('opacity', 1);
			console.log(($(this.numberPrefix + 'el').getStyle(this.slideProperty).replace("px","")));
		},
		
		moveSlideRight: function(){			
			if(this.leftTimes == 0)
				return false;
			this.leftTimes--;			
			$(this.numberPrefix+'el').tween('opacity', this.options.opacityLevel).tween(this.slideProperty, -(this.wid+this.options.imgPadding)*this.options.slideStep*this.leftTimes).tween('opacity', 1);
		}		
	});