//META{"name":"BlurNSFW"}*//

var BlurNSFW = (function() {

class Plugin {
	getName(){return "BlurNSFW"}
	getShortName() {return "bnsfw"}
	getDescription(){return "Blurs images in NSFW channels until you hover over it. Support Server: bit.ly/ZeresServer"}
	getVersion(){return "0.1.2"}
	getAuthor(){return "Zerebos"}
	
	load(){}
	unload(){}
	
	start(){
		this.style = `:root {--blur-nsfw: 10px;}
		.attachment-image img, .embed-thumbnail img, .attachment-image canvas, .embed-thumbnail canvas {
			transition: 200ms cubic-bezier(.2, .11, 0, 1) !important;
			filter: blur(0px);
		}
		.attachment-image img.blur, .embed-thumbnail img.blur, .attachment-image canvas.blur, .embed-thumbnail canvas.blur {
			filter: blur(var(--blur-nsfw))
		}`
		BdApi.injectCSS(this.getShortName(), this.style)
		this.blurStuff()
	}
	stop(){
		this.jqui.remove()
		BdApi.clearCSS(this.getShortName())
	}

	getReactInstance(node) { 
		return node[Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))];
	}

	isNSFWChannel() {
		return this.getReactInstance($('.title-wrap')[0])._currentElement.props.children[2].props.channel.nsfw
	}

	blurStuff(node) {
		if (!this.isNSFWChannel()) return;

		var blurAction = (index, elem) => {
			var img = $(elem)
			if (!img.hasClass("blur")) {
				img.addClass("blur")
				img.on("mouseenter."+this.getShortName(), (e)=>{$(e.target).removeClass("blur")})
				img.on("mouseleave."+this.getShortName(), (e)=>{$(e.target).addClass("blur")})
			}
		}

		$('.attachment-image img').each(blurAction)
		$('.embed-thumbnail img').each(blurAction)
		$('.attachment-image canvas').each(blurAction)
		$('.embed-thumbnail canvas').each(blurAction)
	}

	observer(e){

		if (!e.addedNodes.length) return;
		var elem = $(e.addedNodes[0])

		if (elem.parents(".messages.scroller").length || elem.find(".message-group").parents(".messages.scroller").length) {
			this.blurStuff()
		}

		if (elem.hasClass(".image").length || elem.find("span.image").parents(".messages.scroller").length) {
			this.blurStuff()
		}

	}

	getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		var header = $('<div class="formNotice-2tZsrh margin-bottom-20 padded card-3DrRmC">')//.css("background", SettingField.getAccentColor()).css("border-color", "transparent")
		var headerText = $('<div class="default-3bB32Y formText-1L-zZB formNoticeBody-1C0wup whiteText-32USMe modeDefault-389VjU primary-2giqSn">')
		headerText.html("To update the blur amount change the css variable <span style='font-family: monospace;'>--blur-nsfw</span> to something like <span style='font-family: monospace;'>20px</span>")
		headerText.css("line-height", "150%")
		headerText.appendTo(header)
		header.appendTo(panel)
		return panel[0]
	}
}


return Plugin
})();
