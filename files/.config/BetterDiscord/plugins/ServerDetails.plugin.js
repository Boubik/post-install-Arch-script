/**
 * @name ServerDetails
 * @author DevilBro
 * @authorId 278543574059057154
 * @version 1.1.3
 * @description Shows Server Details in the Server List Tooltip
 * @invite Jx3TjNS
 * @donate https://www.paypal.me/MircoWittrien
 * @patreon https://www.patreon.com/MircoWittrien
 * @website https://mwittrien.github.io/
 * @source https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/ServerDetails/
 * @updateUrl https://mwittrien.github.io/BetterDiscordAddons/Plugins/ServerDetails/ServerDetails.plugin.js
 */

module.exports = (_ => {
	const changeLog = {
		
	};

	return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
		constructor (meta) {for (let key in meta) this[key] = meta[key];}
		getName () {return this.name;}
		getAuthor () {return this.author;}
		getVersion () {return this.version;}
		getDescription () {return `The Library Plugin needed for ${this.name} is missing. Open the Plugin Settings to download it. \n\n${this.description}`;}
		
		downloadLibrary () {
			require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
				if (!e && b && r.statusCode == 200) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => BdApi.showToast("Finished downloading BDFDB Library", {type: "success"}));
				else BdApi.alert("Error", "Could not download BDFDB Library Plugin. Try again later or download it manually from GitHub: https://mwittrien.github.io/downloader/?library");
			});
		}
		
		load () {
			if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {pluginQueue: []});
			if (!window.BDFDB_Global.downloadModal) {
				window.BDFDB_Global.downloadModal = true;
				BdApi.showConfirmationModal("Library Missing", `The Library Plugin needed for ${this.name} is missing. Please click "Download Now" to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onCancel: _ => {delete window.BDFDB_Global.downloadModal;},
					onConfirm: _ => {
						delete window.BDFDB_Global.downloadModal;
						this.downloadLibrary();
					}
				});
			}
			if (!window.BDFDB_Global.pluginQueue.includes(this.name)) window.BDFDB_Global.pluginQueue.push(this.name);
		}
		start () {this.load();}
		stop () {}
		getSettingsPanel () {
			let template = document.createElement("template");
			template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${this.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
			template.content.firstElementChild.querySelector("a").addEventListener("click", this.downloadLibrary);
			return template.content.firstElementChild;
		}
	} : (([Plugin, BDFDB]) => {
		var _this;
	
		const GuildDetailsComponent = class GuildDetails extends BdApi.React.Component {
			constructor(props) {
				super(props);
				this.state = {fetchedOwner: false, delayed: false, repositioned: false};
			}
			componentDidUpdate() {
				if (_this.settings.amounts.tooltipDelay && this.state.delayed && !this.state.repositioned) {
					this.state.repositioned = true;
					if (this.props.tooltipContainer && this.props.tooltipContainer.tooltip) this.props.tooltipContainer.tooltip.update();
				}
			}
			render() {
				if (_this.settings.general.onlyShowOnShift && !this.props.shiftKey) return null;
				if (_this.settings.amounts.tooltipDelay && !this.state.delayed) {
					BDFDB.TimeUtils.timeout(_ => {
						this.state.delayed = true;
						if (this.props.tooltipContainer && this.props.tooltipContainer.tooltip) BDFDB.DOMUtils.addClass(this.props.tooltipContainer.tooltip.firstElementChild, BDFDB.disCN._serverdetailstooltip);
						BDFDB.ReactUtils.forceUpdate(this);
					}, _this.settings.amounts.tooltipDelay * 1000);
					return null;
				}
				let owner = BDFDB.LibraryStores.UserStore.getUser(this.props.guild.ownerId);
				if (!owner && !this.state.fetchedOwner) {
					this.state.fetchedOwner = true;
					BDFDB.LibraryModules.UserProfileUtils.getUser(this.props.guild.ownerId).then(_ => BDFDB.ReactUtils.forceUpdate(this));
				}
				let src = this.props.guild.getIconURL(4096, this.props.guild.icon && BDFDB.LibraryModules.IconUtils.isAnimatedIconHash(this.props.guild.icon));
				return BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.Flex, {
					direction: BDFDB.LibraryComponents.Flex.Direction.VERTICAL,
					align: BDFDB.LibraryComponents.Flex.Align.CENTER,
					children: [
						_this.settings.items.icon && (src ? BDFDB.ReactUtils.createElement("img", {
							className: BDFDB.disCN._serverdetailsicon,
							src: src
						}) : BDFDB.ReactUtils.createElement("div", {
							className: BDFDB.disCN._serverdetailsicon,
							children: this.props.guild.acronym
						})),
						_this.settings.items.owner && BDFDB.ReactUtils.createElement(GuildDetailsRowComponent, {
							prefix: BDFDB.LanguageUtils.LanguageStrings.GUILD_OWNER,
							string: `${owner ? owner.username : "Unknown"}#${owner ? owner.discriminator : "0000"}`
						}),
						_this.settings.items.creationDate && BDFDB.ReactUtils.createElement(GuildDetailsRowComponent, {
							prefix: _this.labels.creation_date,
							string: BDFDB.LibraryComponents.DateInput.format(_this.settings.dates.tooltipDates, BDFDB.LibraryModules.TimestampUtils.extractTimestamp(this.props.guild.id))
						}),
						_this.settings.items.joinDate && BDFDB.ReactUtils.createElement(GuildDetailsRowComponent, {
							prefix: _this.labels.join_date,
							string: BDFDB.LibraryComponents.DateInput.format(_this.settings.dates.tooltipDates, this.props.guild.joinedAt)
						}),
						_this.settings.items.members && BDFDB.ReactUtils.createElement(GuildDetailsRowComponent, {
							prefix: BDFDB.LanguageUtils.LanguageStrings.MEMBERS,
							string: BDFDB.LibraryStores.GuildMemberCountStore.getMemberCount(this.props.guild.id)
						}),
						_this.settings.items.boosts && BDFDB.ReactUtils.createElement(GuildDetailsRowComponent, {
							prefix: _this.labels.boosts,
							string: this.props.guild.premiumSubscriberCount
						}),
						_this.settings.items.channels && BDFDB.ReactUtils.createElement(GuildDetailsRowComponent, {
							prefix: BDFDB.LanguageUtils.LanguageStrings.CHANNELS,
							string: BDFDB.LibraryStores.GuildChannelStore.getChannels(this.props.guild.id).count
						}),
						_this.settings.items.roles && BDFDB.ReactUtils.createElement(GuildDetailsRowComponent, {
							prefix: BDFDB.LanguageUtils.LanguageStrings.ROLES,
							string: Object.keys(this.props.guild.roles).length
						}),
						_this.settings.items.language && BDFDB.ReactUtils.createElement(GuildDetailsRowComponent, {
							prefix: BDFDB.LanguageUtils.LanguageStrings.LANGUAGE,
							string: BDFDB.LanguageUtils.getName(BDFDB.LanguageUtils.languages[this.props.guild.preferredLocale]) || this.props.guild.preferredLocale
						})
					].flat(10).filter(n => n)
				});
			}
		};
		
		const GuildDetailsRowComponent = class GuildDetailsRow extends BdApi.React.Component {
			render() {
				return (this.props.prefix.length + this.props.string.length) > Math.round(34 * (_this.settings.amounts.tooltipWidth/300)) ? [
					BDFDB.ReactUtils.createElement("div", {
						children: `${this.props.prefix}:`
					}),
					BDFDB.ReactUtils.createElement("div", {
						children: this.props.string
					})
				] : BDFDB.ReactUtils.createElement("div", {
					children: `${BDFDB.StringUtils.upperCaseFirstChar(this.props.prefix)}: ${this.props.string}`
				});
			}
		};
		
		return class ServerDetails extends Plugin {
			onLoad () {
				_this = this;
				
				this.defaults = {
					general: {
						onlyShowOnShift:	{value: false,	description: "Only show the Details Tooltip, while holding 'Shift'"}
					},
					items: {
						icon:				{value: true, 	description: "GUILD_CREATE_UPLOAD_ICON_LABEL"},
						owner:				{value: true, 	description: "GUILD_OWNER"},
						creationDate:		{value: true, 	description: "creation_date"},
						joinDate:			{value: true, 	description: "join_date"},
						members:			{value: true, 	description: "MEMBERS"},
						channels:			{value: true, 	description: "CHANNELS"},
						roles:				{value: true, 	description: "ROLES"},
						boosts:				{value: true, 	description: "boosts"},
						language:			{value: true, 	description: "LANGUAGE"}
					},
					dates: {
						tooltipDates:		{value: {}, 	description: "Tooltip Dates"}
					},
					colors: {
						tooltipColor:		{value: "", 	description: "Tooltip Color"}
					},
					amounts: {
						tooltipDelay:		{value: 0,		min: 0,		max: 10,	digits: 1,	unit: "s",	description: "Tooltip Delay"},
						tooltipWidth:		{value: 300,	min: 200,	max: 600,	digits: 0,	unit: "px",	description: "Tooltip Width"}
					}
				};
			
				this.modulePatches = {
					after: [
						"GuildItem"
					]
				};
				
				this.patchPriority = 9;
				
				this.css = `
					${BDFDB.dotCNS._serverdetailstooltip + BDFDB.dotCN.tooltipcontent} {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
					}
					${BDFDB.dotCNS._serverdetailstooltip + BDFDB.dotCN._serverdetailsicon} {
						display: flex;
						justify-content: center;
						align-items: center;
						margin-bottom: 5px;
						border-radius: 10px;
						overflow: hidden;
					}
					${BDFDB.dotCN._serverdetailstooltip} div${BDFDB.dotCN._serverdetailsicon} {
						background-color: var(--background-primary);
						color: var(--text-normal);
						font-size: 40px;
					}
				`;
			}
			
			onStart () {
				this.forceUpdateAll();
			}
			
			onStop () {
				this.forceUpdateAll();
				
				BDFDB.DOMUtils.removeLocalStyle(this.name + "TooltipWidth");
			}

			getSettingsPanel (collapseStates = {}) {
				let settingsPanel;
				return settingsPanel = BDFDB.PluginUtils.createSettingsPanel(this, {
					collapseStates: collapseStates,
					children: _ => {
						let settingsItems = [];
						
						settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.CollapseContainer, {
							title: "Settings",
							collapseStates: collapseStates,
							children: Object.keys(this.defaults.general).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
								type: "Switch",
								plugin: this,
								keys: ["general", key],
								label: this.defaults.general[key].description,
								value: this.settings.general[key]
							}))
						}));
						
						settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.CollapseContainer, {
							title: "Tooltip Items",
							collapseStates: collapseStates,
							children: Object.keys(this.defaults.items).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
								type: "Switch",
								plugin: this,
								keys: ["items", key],
								label: this.labels[this.defaults.items[key].description] || BDFDB.LanguageUtils.LanguageStrings[this.defaults.items[key].description],
								value: this.settings.items[key]
							}))
						}));
						
						settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.CollapseContainer, {
							title: "Tooltip Format",
							collapseStates: collapseStates,
							children: Object.keys(this.defaults.dates).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.DateInput, Object.assign({}, this.settings.dates[key], {
								label: this.defaults.dates[key].description,
								onChange: valueObj => {
									this.SettingsUpdated = true;
									this.settings.dates[key] = valueObj;
									BDFDB.DataUtils.save(this.settings.dates, this, "dates");
								}
							}))).concat(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormDivider, {
								className: BDFDB.disCN.marginbottom8
							})).concat(Object.keys(this.defaults.amounts).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
								type: "Slider",
								plugin: this,
								keys: ["amounts", key],
								label: this.defaults.amounts[key].description,
								basis: "70%",
								min: this.defaults.amounts[key].min,
								max: this.defaults.amounts[key].max,
								digits: this.defaults.amounts[key].digits,
								markerAmount: 11,
								onValueRender: value => value + this.defaults.amounts[key].unit,
								childProps: {type: "number"},
								value: this.settings.amounts[key]
							}))).concat(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.FormComponents.FormDivider, {
								className: BDFDB.disCN.marginbottom8
							})).concat(Object.keys(this.defaults.colors).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
								type: "TextInput",
								plugin: this,
								keys: ["colors", key],
								basis: "70%",
								label: this.defaults.colors[key].description,
								value: this.settings.colors[key],
								childProps: {type: "color"},
								placeholder: this.settings.colors[key]
							})))
						}));
						
						return settingsItems;
					}
				});
			}

			onSettingsClosed () {
				if (this.SettingsUpdated) {
					delete this.SettingsUpdated;
					this.forceUpdateAll();
				}
			}
		
			forceUpdateAll () {				
				let iconSize = this.settings.amounts.tooltipWidth - 80;
				BDFDB.DOMUtils.appendLocalStyle(this.name + "TooltipWidth", `
					${BDFDB.dotCN._serverdetailstooltip} {
						min-width: ${this.settings.amounts.tooltipWidth}px !important;
						width: unset !important;
						max-width: unset !important;
					}
					${BDFDB.dotCNS._serverdetailstooltip + BDFDB.dotCN._serverdetailsicon} {
						width: ${iconSize > 0 ? iconSize : 30}px;
						height: ${iconSize > 0 ? iconSize : 30}px;
					}
				`);
				
				BDFDB.DiscordUtils.rerenderAll();
			}
			
			processGuildItem (e) {
				if (!BDFDB.GuildUtils.is(e.instance.props.guild)) return;
				let tooltipContainer;
				let [children, index] = BDFDB.ReactUtils.findParent(e.returnvalue, {name: ["GuildTooltip", "BDFDB_TooltipContainer"]});
				if (index > -1) children[index] = BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TooltipContainer, Object.assign({}, children[index].props, {
					ref: instance => {if (instance) tooltipContainer = instance;},
					tooltipConfig:  Object.assign({
						backgroundColor: this.settings.colors.tooltipColor
					}, children[index].props.tooltipConfig, {
						className: !this.settings.amounts.tooltipDelay && BDFDB.disCN._serverdetailstooltip,
						type: "right",
						guild: e.instance.props.guild,
						list: true,
						offset: 12
					}),
					text: (instance, event) => BDFDB.ReactUtils.createElement(GuildDetailsComponent, {
						shiftKey: event.shiftKey,
						tooltipContainer: tooltipContainer,
						guild: e.instance.props.guild
					})
				}));
			}

			setLabelsByLanguage () {
				switch (BDFDB.LanguageUtils.getLanguage().id) {
					case "bg":		// Bulgarian
						return {
							boosts:								"??????????????",
							creation_date:						"???????? ???? ??????????????????",
							join_date:							"???????? ???? ????????????????????????????"
						};
					case "da":		// Danish
						return {
							boosts:								"Boosts",
							creation_date:						"Oprettelsesdato",
							join_date:							"Deltag i dato"
						};
					case "de":		// German
						return {
							boosts:								"Boosts",
							creation_date:						"Erstellungsdatum",
							join_date:							"Beitrittsdatum"
						};
					case "el":		// Greek
						return {
							boosts:								"??????????????????",
							creation_date:						"???????????????????? ??????????????????????",
							join_date:							"???????????????????? ??????????????????????"
						};
					case "es":		// Spanish
						return {
							boosts:								"Impulsores",
							creation_date:						"Fecha de creaci??n",
							join_date:							"Fecha de Ingreso"
						};
					case "fi":		// Finnish
						return {
							boosts:								"Tehostimet",
							creation_date:						"Luomisp??iv??",
							join_date:							"Liittymisp??iv??"
						};
					case "fr":		// French
						return {
							boosts:								"Boosts",
							creation_date:						"Date de cr??ation",
							join_date:							"Date d'inscription"
						};
					case "hr":		// Croatian
						return {
							boosts:								"Poja??ala",
							creation_date:						"Datum stvaranja",
							join_date:							"Datum pridru??ivanja"
						};
					case "hu":		// Hungarian
						return {
							boosts:								"Eml??keztet??k",
							creation_date:						"L??trehoz??s d??tuma",
							join_date:							"Csatlakoz??s d??tuma"
						};
					case "it":		// Italian
						return {
							boosts:								"Boosts",
							creation_date:						"Data di creazione",
							join_date:							"Data di iscrizione"
						};
					case "ja":		// Japanese
						return {
							boosts:								"???????????????",
							creation_date:						"?????????",
							join_date:							"?????????"
						};
					case "ko":		// Korean
						return {
							boosts:								"?????????",
							creation_date:						"?????? ???",
							join_date:							"?????? ??????"
						};
					case "lt":		// Lithuanian
						return {
							boosts:								"Stiprintuvai",
							creation_date:						"Suk??rimo data",
							join_date:							"??stojimo data"
						};
					case "nl":		// Dutch
						return {
							boosts:								"Boosts",
							creation_date:						"Aanmaakdatum",
							join_date:							"Toetredingsdatum"
						};
					case "no":		// Norwegian
						return {
							boosts:								"Boosts",
							creation_date:						"Opprettelsesdato",
							join_date:							"Bli med p?? dato"
						};
					case "pl":		// Polish
						return {
							boosts:								"Boosty",
							creation_date:						"Data utworzenia",
							join_date:							"Data do????czenia"
						};
					case "pt-BR":	// Portuguese (Brazil)
						return {
							boosts:								"Boosts",
							creation_date:						"Data de cria????o",
							join_date:							"Data de afilia????o"
						};
					case "ro":		// Romanian
						return {
							boosts:								"Amplificatoare",
							creation_date:						"Data crearii",
							join_date:							"Data ??nscrierii"
						};
					case "ru":		// Russian
						return {
							boosts:								"??????????????",
							creation_date:						"???????? ????????????????",
							join_date:							"???????? ????????????????????"
						};
					case "sv":		// Swedish
						return {
							boosts:								"Boosts",
							creation_date:						"Skapelsedagen",
							join_date:							"G?? med datum"
						};
					case "th":		// Thai
						return {
							boosts:								"????????????????????????",
							creation_date:						"?????????????????????????????????",
							join_date:							"??????????????????????????????????????????"
						};
					case "tr":		// Turkish
						return {
							boosts:								"G????lendiriciler",
							creation_date:						"Olu??turulma tarihi",
							join_date:							"??yelik Tarihi"
						};
					case "uk":		// Ukrainian
						return {
							boosts:								"??????????????????????",
							creation_date:						"???????? ??????????????????",
							join_date:							"???????? ????????????????????"
						};
					case "vi":		// Vietnamese
						return {
							boosts:								"B??? t??ng t???c",
							creation_date:						"Ng??y th??nh l???p",
							join_date:							"Ng??y tham gia"
						};
					case "zh-CN":	// Chinese (China)
						return {
							boosts:								"?????????",
							creation_date:						"????????????",
							join_date:							"????????????"
						};
					case "zh-TW":	// Chinese (Taiwan)
						return {
							boosts:								"?????????",
							creation_date:						"????????????",
							join_date:							"????????????"
						};
					default:		// English
						return {
							boosts:								"Boosts",
							creation_date:						"Creation Date",
							join_date:							"Join Date"
						};
				}
			}
		};
	})(window.BDFDB_Global.PluginUtils.buildPlugin(changeLog));
})();
