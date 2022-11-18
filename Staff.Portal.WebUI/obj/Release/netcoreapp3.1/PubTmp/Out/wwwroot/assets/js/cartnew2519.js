var beneficiariesToBeUpdates = [];

const lsObject = Object.freeze({
  BENEFICIARY: 'BENEFICIARY',
  ITEMS: 'ITEMS',
  SELECTED: 'SELECTED',
  REQUESTED_FOR_HARD_COPY: 'REQUESTED_FOR_HARD_COPY',
  TOTAL_PRICE: 'TOTAL_PRICE',
});

const beneficiaryAction = Object.freeze({
  CLONE: 'CLONE',
  ADD: 'ADD',
  EDIT: 'EDIT'
});

selectedItems = [];
selectedBeneficiary = '';
cloneDetails = {
    flag: false,
    cloneId: ''
};

function toggleCartItems(context) {
  $('.cart-items-container').toggle();
  if ($(context).html().indexOf('Hide Cart Items') != -1) {
    $(context).html('<i class="fa fa-expand"></i>Show Cart Items');
  } else {
    $(context).html('<i class="fa fa-compress"></i>Hide Cart Items');
  }
}
    
function toggleAddBeneficiary(context) {
  $('.benificiary-item-edit-mode').toggle();
  if ($(context).html().indexOf('Add More Beneficiary') != -1) {
    $(context).html('<i class="fa fa-compress"></i>Hide');
  } else {
    $(context).html('<i class="fa fa-expand"></i>Add More Beneficiary');
  }
}

function isMaxBeneficiaryCount() {
  var allBen = getObjectFromLS(lsObject.BENEFICIARY);
  return (Object.keys(allBen).length >= 10);
}

function addItemsToBenificiary() {
  const beneficiaryId = selectedBeneficiary, 
  itemIds = selectedItems;
	if(itemIds.length > 0) {
	  var functionName = 'updateBenificiaryItems';

	if (!(beneficiaryId && itemIds)) { 
		console.log(functionName, ' : Arguments Not Valid: beneficiaryId, itemIds', beneficiaryId, itemIds);
		return;
	}

	var beneficiaryToBeUpdated = getObjectFromLS(lsObject.BENEFICIARY, beneficiaryId);

	if (beneficiaryToBeUpdated) {

		var itemsInBenificiary = beneficiaryToBeUpdated['items'] ? beneficiaryToBeUpdated['items'] : [];
		var itemNotAdded = false;	
		
        var isMaxOfferCountReached = function (selectedIds) {
            var maxOfferCount = 2;
            var currentCount = 0;
            var cartItems = getObjectFromLS(lsObject.ITEMS);
            selectedIds.map(function (selId) {
                if (cartItems[selId].type == "OFFER") {
                    currentCount++;
                }
            });
            return (currentCount >= maxOfferCount);
        };
		
        var addMissingItem = function (itemId) {
            if (itemsInBenificiary.indexOf(itemId) == -1) {
                if (!isMaxItemsReached(beneficiaryToBeUpdated, itemId)) {
                    itemsInBenificiary.push(itemId);
                }
            }
        };
		
		function isMaxItemsReached(beneficiary, itemToAdd) {
		  var currentItemsLength = beneficiary.items.toString().length;
		  if (currentItemsLength < 240 && (currentItemsLength + itemToAdd).length < 240) {
		    return false;
		  } else {
		    itemNotAdded = true;
		    return true;  
		  }
        }
		
		if (isMaxOfferCountReached(itemIds)) {
		  updateMessageForMaxOfferLimit(beneficiaryId);
		  return;
		} else {
		  $('[data-id="'+beneficiaryId+'"] .updated-offers').text("");
		}

		itemIds.forEach(addMissingItem);

		beneficiaryToBeUpdated["items"] = itemsInBenificiary;
		beneficiaryToBeUpdated['id'] = beneficiaryId;

    toggleActionBtnByDirtyFlag(true);
		setBeneficiary(beneficiaryToBeUpdated);
		
		renderHtml(lsObject.BENEFICIARY, true);
		selectedItems = [];
		selectedBeneficiary = '';
		$("#itemsParent input:checkbox").prop('checked', false);
		$('#globalItemContainer').click();
		setTimeout(function() {
        updatePriceInCart();
      }, 1000);
        $('#select-all-btn').show();
    toggleZerothSelect('#zerothSelectProduct', true);
    toggleZerothSelect('#zerothSelectBen', true);
	} else {
		console.log(functionName, ' : no beneficiary found with beneficiaryId ', beneficiaryId);
	}
	} else {
	  console.log('no items selected');
	}
	
	
	if (itemNotAdded) {
	  alertModal(true, { title: 'Unable to add more tests', body: 'You\'ve reached the maximum number of tests for ' + beneficiaryToBeUpdated['name'] + '.'
	  + ' You can continue with the current selection or revisit us to place another order.'});
	}
}

function removeItemHandler(self, id) {
  var beneficiaryId = $(self).parent().parent().parent().prop('id');
  removeItemFromBenificiary(beneficiaryId, id);
}

function removeItemFromBenificiary(beneficiaryId, itemId) {
	var functionName = 'removeItemFromBenificiary';

	if (!(beneficiaryId && itemId)) {
		console.log(functionName, ' : Arguments Not Valid: beneficiaryId, itemId', beneficiaryId, itemId);
		return;
	}

	var beneficiaryToBeUpdated = getObjectFromLS(lsObject.BENEFICIARY, beneficiaryId);

	if (beneficiaryToBeUpdated) {

		var items = beneficiaryToBeUpdated['items'];
		
		if (items && items.length && items.length == 1) {
		  if (beneficiaryToBeUpdated && beneficiaryToBeUpdated.hasOwnProperty('removedOfferId')) {
		    delete beneficiaryToBeUpdated.removedOfferId;
		  }
		}
		
		if (items && items.length > 0) {

            var removeItem = function (item) {
                return item != itemId;
            };

			beneficiaryToBeUpdated['items'] = items.filter(removeItem);
			beneficiaryToBeUpdated['id'] = beneficiaryId;
      
            toggleActionBtnByDirtyFlag(true);
			setBeneficiary(beneficiaryToBeUpdated);
			renderHtml(lsObject.BENEFICIARY, true);
            setTimeout(function() {
            updatePriceInCart();
            }, 1000);
            selectedBeneficiary = '';
		} else {
			console.log(functionName, " : beneficiary doesnot contain items ", beneficiary);
		}		
	} else {
		console.log(functionName, ' : no beneficiary found with beneficiaryId ', beneficiaryId);
	}
}

function filterNonSelectedItems(totalItems, selectedItemsIds) {
	const functionName = 'filterNonSelectedItems';

	if (!(totalItems && selectedItemsIds && selectedItemsIds.length > 0 && Object.keys(totalItems))) {
		console.log(functionName, " : arguments not valid ", totalItems, selectedItemsIds);
		return null;
	}

	var totalItemsIds = Object.keys(totalItems);

    var uniqueItems = function (item) { return selectedItemsIds.indexOf(item) == -1 }

	return totalItemsIds.filter(uniqueItems);
}

function getItemsFromAllBenificiaries() {
	var functionName = 'findGetAllItemsFromBenificiaries';

	var beneficiaries = getObjectFromLS(lsObject.BENEFICIARY),
		allSelectedItems = [],
		benificiaryItems = null,
		benificiary = null;
		
	if (beneficiaries) {

		for (benificiaryId in beneficiaries) {
			benificiary = beneficiaries[benificiaryId];
			benificiaryItems = benificiary['items'] ? benificiary['items'] : []; 
			if (benificiary['removedOfferId']) {
			  benificiaryItems = replaceNewOfferIdWithOldId(benificiaryItems, benificiary['removedOfferId']);
			}
			allSelectedItems = allSelectedItems.concat(benificiaryItems);
		}

	} else {
		console.log(functionName, ' : no beneficiaries found');
	}

	return allSelectedItems;
}

function replaceNewOfferIdWithOldId(benificiaryItems, oldId) {
  var cartItems = getObjectFromLS(lsObject.ITEMS);
  var deleteIndex = null;
  var currentBenItems = benificiaryItems.slice();
  
  currentBenItems.map(function(item, index) {
    if (!cartItems[item]) {
      deleteIndex = index;
    }
  });
  
  if (deleteIndex !== null ) {
    currentBenItems.splice(deleteIndex, 1);
    currentBenItems.push(oldId);
  }
  return currentBenItems;
}

function getUniqueItemsFromArray(listOfItems) {

	if (listOfItems && listOfItems.length > 0) {
		var set = new Set(listOfItems);
		return Array.from(set);
	}
	return null;
}

//get values from input boxes for beneficiary details
function getInputValues() {
  const name = $('#ben-name').val(),
    dob = $('#ben-dob').val(),
    gender = $("input[name='ben-gender']:checked").val();
  if(name && dob && gender) {
      return {
          name: name,
          dob: dob,
          gender: gender
      };
  } else {
    console.log('please fill all details to add beneficiary');
    return ;
  }
}

function clearInputValues() {
  $('#ben-name').val('');
    $('#ben-dob').val('');
  $("input:radio").prop("checked", false);
}

function scrollToAddBenSection() {
  var addBenSection = $('.benificiary-item-edit-mode');
  addBenSection.is( ":hidden" ) ? $('#addBeneficiary').click() : null;
  var el = $("#addBeneficiaryDetails");
  var elOffset = el.offset().top;
  var elHeight = el.height();
  var windowHeight = $(window).height();
  var offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
  $('html, body').scrollTop(offset);
}

function cloneButtonHandler(id) {
  scrollToAddBenSection();
    cloneDetails = {
        flag: true,
        cloneId: id
    };
}

function addButtonHandler() {
    cloneDetails.flag
        ? handleBeneficiary(beneficiaryAction.CLONE, cloneDetails.cloneId)
        : handleBeneficiary(beneficiaryAction.ADD);
}

function showItemsClickHandler() {
  var itemsButton = $('.cart-items-container');
  itemsButton.is(':hidden') ? $('#globalItemContainer').click(): null;
}

function getAgeFromDate(DOB) {
  var dobArr = DOB.split('-');
  var dateString = dobArr[1] + '-' + dobArr[0] + '-' + dobArr[2];
  
  var months =  moment().diff(new moment(dateString, 'MM-DD-YYYY'), 'month');
  if (months >= 12) {
    var years =  moment().diff(new moment(dateString, 'MM-DD-YYYY'), 'years');
    return years + ' Year(s)';
  } else {
    return months + ' Month(s)';
  }
}

//add, update or clone a beneficiary base on the action given
function handleBeneficiary(action, benId) {
  if (isMaxBeneficiaryCount()) {
    alertModal(true, { title: 'Beneficiary limit', body: 'You can add a maximum of 10 beneficiaries.'});
    return;
  }
  const getValues = getInputValues();
  if(getValues) {
    const name = getValues.name,
    dob = getValues.dob,
    gender = getValues.gender;
  let id = null;
  switch (action) {
    case beneficiaryAction.ADD:
      id = new Date().getTime();
      setBeneficiary({ id: id, name: name, dob: dob, gender: gender, items: [] }, true);
      if(!cloneDetails.flag) {
        showItemsClickHandler();
        window.scrollTo(0, 0);
        toggleZerothSelect('#zerothSelectProduct', false);
      }
      $('#zerothAddBen').hasClass('hide') ? null : $('#zerothAddBen').addClass('hide');
      break;
    case beneficiaryAction.CLONE:
      id = new Date().getTime();
      const toCloneBeneficiary = getObjectFromLS(lsObject.BENEFICIARY, benId);
      const items = toCloneBeneficiary.items;
      setBeneficiary({ id: id, name: name, dob: dob, gender: gender, items: items }, true);
          cloneDetails = {
              flag: false,
              id: ''
          };
      setTimeout(function() {
        updatePriceInCart();
      }, 1000);
      break;
    case beneficiaryAction.EDIT:
      setBeneficiary({ id: benId, name: name, dob: dob, gender: gender }, true);
      break;
    default:
      console.log('please give appropriate action');
  }
  }
}

//add a beneficiary in local storage
function setBeneficiary(ben, renderFlag) {
  if(ben) {
    const id = ben.id,
      name = ben.name,
      dob = ben.dob,
      gender = ben.gender,
      items = ben.items;
    let removedOfferId = ben.hasOwnProperty('removedOfferId') ? ben.removedOfferId : null;
    if(id && dob && gender && name) {
      let beneficiaryList = getObjectFromLS(lsObject.BENEFICIARY, undefined);
      beneficiaryList[id] = {
        name: name,
        dob: dob,
        gender: gender,
        //if items is present then add the new items, or else get items from a beneficiary(in case of clone)
        items: items ? items : beneficiaryList[id].items,
        removedOfferId: removedOfferId
      };
      setObjectToLS(lsObject.BENEFICIARY, beneficiaryList);
      if(renderFlag) {
        clearInputValues();
        $('#addBeneficiary').click();
        var benObj = Object.assign(lsObject.BENEFICIARY);
        renderHtml(lsObject.BENEFICIARY, true);
        setTimeout(function() {
          $("input[name=selectedBeneficiary][value="+id+"]").prop('checked', true);
          selectedBeneficiary = id;
        }, 500);
      }
    }
  } else {
    console.log('please pass beneficiary details to add beneficiary');
  }
}

//to delete beneficiary with given id from beneficiary list in local stroage
function deleteBeneficiary(id) {
  if(id) {
    let beneficiaryList = getObjectFromLS(lsObject.BENEFICIARY, undefined);
    delete beneficiaryList[id];
    setObjectToLS(lsObject.BENEFICIARY, beneficiaryList);
    renderHtml(lsObject.BENEFICIARY, true);
    setTimeout(function() {
        updatePriceInCart();
      }, 1000);
    selectedBeneficiary = '';
  } else {
    console.log('please pass id to delete a beneficiary');
  }
}

//get object or a property of an object from local storage
function getObjectFromLS(prop, id, item) {
  //prop needs to be of these kind only
  if(prop) {
    const value = localStorage.getItem(prop);
    return value ? id
        ? item ? JSON.parse(value)[id][item]
          : JSON.parse(value)[id]
        : JSON.parse(value)
      : {};
  } else {
    console.log('please pass prop to get object from local storage');
  }
}

function thyronomics() {
  var beneficiaryList = getObjectFromLS(lsObject.BENEFICIARY);
  var loginDetails = JSON.parse(localStorage.getItem('LOGIN_DETAILS'));
  var customerPhoneNumber = JSON.parse(localStorage.getItem('customerPhoneNumber'));
  var thyronomicsArray = [];
  for (beneficiary in beneficiaryList) {
    thyronomicsArray.push(thyronomicsBeneficiary(beneficiaryList[beneficiary].items, 'loginDetails.API_KEY', customerPhoneNumber));
  }
}

function thyronomicsBeneficiary(itemList, apikey, mobile) {
  var rate = [],
    product = [];
    itemList.forEach(function (itemId) {
        var item = getObjectFromLS(lsObject.ITEMS, itemId);
        rate.push(item.rate);
        product.push(item.name);
    });
    return {
        api_key: apikey,
        product: product.toString(),
        rate: rate.toString(),
        User_type: 'public',
        mobile: mobile
    };
}

function renderHtml(prop, isBen) {
  let properties = getObjectFromLS(prop), 
    templateId = prop.toLowerCase()+'Template', // item template id
    parentContainer = $('#'+prop.toLowerCase()+'Parent'); // parent container

    parentContainer.empty();
  // do we clear parent it ?
  
    if (isBen) {
      Object.keys(properties).map(function(benId) {
        properties[benId].dob = getAgeFromDate(properties[benId].dob);
      });
    }
      
  if (properties && Object.keys(properties)) {
    
  	for (propertyId in properties) {

		let item = $(getTemplatedHtml(templateId, properties[propertyId], propertyId));

		if(isBen) {
			let $beneficiaryItem = $(getHTMLforBeneficiaryItems(propertyId));
      let $itemsElementInBeneficiary = $(item.find('.benItems')[0]);
      $itemsElementInBeneficiary.empty();
			$itemsElementInBeneficiary.append($beneficiaryItem);
			properties[propertyId].thyronomicsOffers 
      ? renderThyronomicsOffers(propertyId, properties[propertyId].thyronomicsOffers, item) 
      : null;
		}
            parentContainer.append(item);
      }
  }
}

function getTemplatedHtml(templateId, data, propertyId) {
  const functionName = 'getTemplatedHtml';

  if (!( templateId && data )) {
    console.log(functionName, " : argument not valid ", templateId, data);
    return null;
  }

  let template = document.getElementById(templateId),
    templateHtml = template ? template.innerHTML : null;

  if (template && templateHtml) {
    for (propertyName in data) {
      let regex = new RegExp("{"+propertyName+"}", "g");
      templateHtml = templateHtml.replace(regex, data[propertyName]);
    }
    templateHtml = propertyId ? templateHtml.replace(/{id}/g, propertyId) : templateHtml;
  } else {
    console.log(functionName, " : template or templateHtml not valid. template : ", templateId, data);
  }

  return templateHtml;
}

function getHTMLforBeneficiaryItems(beneficiaryId) {
  
  if (!beneficiaryId) {
    return "";
  }
  
  var removedOfferId  = getObjectFromLS(lsObject.BENEFICIARY, beneficiaryId, 'removedOfferId');
  var beneficiaryItems = getObjectFromLS(lsObject.BENEFICIARY, beneficiaryId, 'items'),
      beneficiaryItemTemplateId = 'beneficiaryItemTemplate',
      allItemsHtml = "";
      
  if (beneficiaryItems && beneficiaryItems.length > 0) {    
    
      var templateItem = function (itemId) {
          let item = getObjectFromLS(lsObject.ITEMS, itemId);
          if (!item && removedOfferId && !_.isEmpty(removedOfferId)) {
              item = getObjectFromLS(lsObject.ITEMS, removedOfferId);
          }
          allItemsHtml += getTemplatedHtml(beneficiaryItemTemplateId, item, itemId);
      };
    
    beneficiaryItems.forEach(templateItem);
  }
  
  return allItemsHtml;
  
}

function updatePriceInCart() {
  var requestStatus = JSON.parse(localStorage.getItem(lsObject.REQUESTED_FOR_HARD_COPY));
  if(requestStatus === undefined || requestStatus === null) {
    localStorage.setItem(lsObject.REQUESTED_FOR_HARD_COPY, false);
  } else {
    $('#reportHardCopy').prop('checked', requestStatus);
  }
  var totalPrice = getCartPrice();
  var discount = Number($('#cartDiscount').text());
  $('#cartSubtotal').text(totalPrice);
  // totalPrice = requestStatus ? totalPrice + 50 : totalPrice;
  $('#cartTotal').text(totalPrice);
  var lsPrice = localStorage.getItem(lsObject.TOTAL_PRICE);
  lsPrice = totalPrice;
  localStorage.setItem(lsObject.TOTAL_PRICE, lsPrice);
  
  var loyaltyDiscount = localStorage.getItem('LOYALTY_DISCOUNT');
  var onlineDiscount = localStorage.getItem('ONLINE_DISCOUNT');
  
  if (loyaltyDiscount == null || loyaltyDiscount == 0) {
    $('#loyaltyDiscount').text('0');
    $('#loyalty-discount-container').hide();
  } else {
    $('#loyaltyDiscount').text(loyaltyDiscount);
    $('#loyalty-discount-container').show();
  }
  
  if (onlineDiscount == null || onlineDiscount == 0) {
    $('#onlineDiscount').text(0);
    $('#online-discount-container').hide();
  } else {
    $('#onlineDiscount').text(onlineDiscount);
    $('#online-discount-container').show();
  }
  
  if (discount > 0) {
   $('.total-discount').css('color', 'red');
  } else {
    $('.total-discount').css('color', 'black');
  } 
}

function getCartPrice() {
  var allAddedItems = getItemsFromAllBenificiaries();
      total = getPriceForItems(allAddedItems);      
  return total;  
}

function getPriceForItems(listOfItemIds) { 
	var total = 0;

	if (listOfItemIds && listOfItemIds.length > 0) {
		
        var caluclatePrice = function (itemId) {
            let item = getObjectFromLS(lsObject.ITEMS, itemId);
            if (item && item.rate) {
                let price = parseFloat(item.rate);
                total += price ? price : 0;
            }
        };

		listOfItemIds.forEach(caluclatePrice);
	}
	return total;
}

function toggleZerothSelect(id,boolean) {
  var zeroth = $(id);
    boolean
        ? zeroth.hasClass('hide') ? null : zeroth.addClass('hide')
        : zeroth.hasClass('hide') ? zeroth.removeClass('hide') : null;
}

function getSelectedItems(event, self, id) {
  if(selectedBeneficiary === '') {
    var benLIst = getObjectFromLS(lsObject.BENEFICIARY);
    benLIst.keys ? null : toggleZerothSelect('#zerothSelectBen', false);
  }
  if(id && selectedBeneficiary!== '') {
    if ($(self).prop('checked')) {
      selectedItems.push(id);
    } else {
      var index = selectedItems.indexOf(id);
      selectedItems.splice(index, 1);
      $('#select-all-btn').show();
    }
  } else {
    event.preventDefault();
    console.log('please select item to proceed');
  }
}

function setSelectedBeneficiary(self, id) {
  if(id) {
    selectedBeneficiary = $(self).prop('checked') ? id : '';
    toggleZerothSelect('#zerothSelectBen', true);
  }
}

function requestedHardCopy(self) {
  let requestedForHardCopy = localStorage.getItem(lsObject.REQUESTED_FOR_HARD_COPY);
  requestedForHardCopy = $(self).is(':checked');
  localStorage.setItem(lsObject.REQUESTED_FOR_HARD_COPY, requestedForHardCopy); 
  toggleActionBtnByDirtyFlag(true);
}


function setCompareData(event, self, detailsFlag) {
  var profile = $($(self).find('span.hide')).html();
  profile = profile.replace(/<[!-\w\/]*>/ig, '').replace(/(<([^>]+)>)/ig, '');
  var el = $(self).first().children()[1];
  var index1 = null;
  
  var compare = (localStorage.getItem('compare')).replace(/<[!-\w\/]*>/ig, '').replace(/(<([^>]+)>)/ig, '');
  compare = JSON.parse(compare);
  if(el.checked) {
    if(compare.length == 3) {
      event.preventDefault();
      return false;
    }
    if(!compare || compare.length < 3) {
      compare.push(profile);
      localStorage.setItem('compare', JSON.stringify(compare));
    } else {
      //$("#myModalcompare").modal("show");
    }
    setTimeout(function() {
      if(compare.length > 1) {
        $('.compare-float').removeClass('hide');
      } 
    }, 300);
  } else {
    var pro = JSON.parse(profile);
    for(l=0;l<compare.length;l++) {
      if(JSON.parse(compare[l]).code == pro.code) {
        index1 = l;
      }
      if(index1 != null) {
        compare.splice(index1, 1);
        localStorage.setItem('compare', JSON.stringify(compare));
      }
    }
    setTimeout(function() {
      if(compare.length < 2) {
        $('.compare-float').addClass('hide');
      } 
    }, 300);
  }
}
        
function compareProfiles(event, self) {
  var compare = JSON.parse(localStorage.getItem('compare'));
  if (compare) {
    var length = compare.length;
    if(length == 2 || length == 3) {
        window.location.href = "/comparison.html";
    }
    else {
      $("#myModal").modal("show");
    }  
  }
}

function areAllItemsUsed() {

	var allUsedItems = getItemsFromAllBenificiaries();
	var allItems = getObjectFromLS(lsObject.ITEMS);

	allItems = allItems ? allItems : {};

	var nonSelectedItems = filterNonSelectedItems(allItems, allUsedItems);

	if (nonSelectedItems && nonSelectedItems.length > 0) {

		var getItemName = function(itemId) {
			var item = getObjectFromLS(lsObject.ITEMS, itemId);
			return item.name;
		};

		var itemsNameList = nonSelectedItems.map(getItemName);

		var displayText = "";

		itemsNameList.forEach(function(itemName) {
			displayText += "<li class='text-left'>"+itemName+"</li>";
		});
		
		var modalFooterHtml = "<div><b>Please review your cart or click proceed to Continue</b></div>";
		var html = "<p>Either you've upgraded or you are yet to add the following tests.</p><ul>"+displayText+"</ul>" + modalFooterHtml;

		confirmationModal(true, {
			title : 'Confirm to proceed',
			body : $(html)
		},true, function() {
		  window.location.href = '/checkout.html';
		  clearThyronomicOffersFromEachBen();
		});

    return false;
	}
  return true;
}

function clearThyronomicOffersFromEachBen() {
  var benList = getObjectFromLS(lsObject.BENEFICIARY);
  for(beneficiary in benList) {
      benList[beneficiary].thyronomicsOffers = [];
  }
  setObjectToLS(lsObject.BENEFICIARY, benList);
}

function doesAllBeneficiariesHaveItems () {
	var beneficieris = getObjectFromLS(lsObject.BENEFICIARY);
	var beneficieriesWithoutItems = [];
	for (beneficiaryId in beneficieris) {
		let beneficiary = beneficieris[beneficiaryId];
		if (!(beneficiary && beneficiary['items'] && beneficiary['items'].length > 0)) {
			beneficieriesWithoutItems = beneficieriesWithoutItems.concat(beneficiary['name']);
		}
	}

	if(beneficieriesWithoutItems && beneficieriesWithoutItems.length > 0) {
		var displayText = "";
		beneficieriesWithoutItems.forEach(function(itemName) {
			displayText += "<li>"+itemName+"</li>";
		});

		alertModal(true, {
			title : 'Following beneficieris does not have any items',
			body : $("<ul>"+displayText+"</ul>")
		}, true);		
		return false;
	}
return true;
}

function areItemsAvailableIncart(obj) {
  var items = getObjectFromLS(obj);
  return Object.keys(items).length > 0;
}

function cartZerothCase() {
  var areItemsPresent = areItemsAvailableIncart(lsObject.ITEMS);
  if(areItemsPresent) {
    $('.non-empty-cart-section').removeClass('hide');
    $('.empty-cart-section').addClass('hide');
    renderHtml(lsObject.ITEMS);
    renderHtml(lsObject.BENEFICIARY, true);
    $('#addBeneficiary').click();
    updatePriceInCart();
    var areBeneficiariesPresent = areItemsAvailableIncart(lsObject.BENEFICIARY);
    var beneficiaryList = getObjectFromLS(lsObject.BENEFICIARY);
    if(!areBeneficiariesPresent) {
      scrollToAddBenSection();
      $('#zerothAddBen').removeClass('hide');
      // $('#globalItemContainer').click();
    } else {
      $("input[name=selectedBeneficiary][value="+Object.keys(beneficiaryList)[0]+"]").prop('checked', true);
      selectedBeneficiary = Object.keys(beneficiaryList)[0];
    }
  } else {
    $('.non-empty-cart-section').addClass('hide');
    $('.empty-cart-section').removeClass('hide');
  }
}


function compareStr(a,b) {  
  if (a && b) {
    a = a.toLowerCase().trim();
    b = b.toLowerCase().trim();
    return a===b;
  }
  return false;
}

function selectAllItems() {
  var itemCheckboxes = $('#itemsParent').find('input[type=checkbox]');
  
  if (!itemCheckboxes.length || selectedBeneficiary == '' ) {
    toggleZerothSelect('#zerothSelectBen', false);
    return;
  }
  
  selectedItems.length = 0;
  _.map(itemCheckboxes, selectItem);
  
  function selectItem(item) {
    // if ($(item).prop('checked')) {
    //   return;
    // }
    $(item).prop('checked', true);
    var clickFunction  = $(item).prop('onclick').toString();
    //var itemId = clickFunction.match(/'[\w]+'/)[0];
    //itemId = itemId.replace(/["']/g, "");
    var itemId = clickFunction.split('\'')[1];
    selectedItems.push(itemId);
  }
  
  $('#select-all-btn').hide();
}


function getThyronomicsRequest(benId) {
  var request = {};
  var beneficiary = getObjectFromLS(lsObject.BENEFICIARY, benId);
  var items = JSON.parse(localStorage.getItem('ITEMS'));
  request.items = getItemsNameForRequest(beneficiary.items);
  request.price = '';
  beneficiary.items.map(function(itemId) {
    if (items[itemId]) {
      request.price += items[itemId].rate + ',';  
    }
  });
  request.price = request.price.substring(0, request.price.length -1);
  return request;
}


function getThyronomicsOffers(benId) {  
  var formName = ".beneficiary-items-container";
  blockUI({
                    target: formName,
                    boxed: true,
                    message: 'checking offers from thyronomics'
                });
  
  var request = getThyronomicsRequest(benId);
  if (!request.items || request.items.length < 1) {
    unblockUI(formName);
    $('#btn-offer-price').hide();
    $('#btn-book').show();
    return;
  }
  
  var API_KEY = getThyronomicsAPIDetailsFromLS().apiKey;
  var mobile = getThyronomicsAPIDetailsFromLS().mobileNumber;
  var url = 'https://b2capi.thyrocare.com/APIs/ORDER.svc/' + API_KEY + 
    '/' + request.items + '/' + request.price +'/'+ mobile +'/public/ThyronomicsOffer';
    
  $.ajax({
    method: 'GET',
    url: url,
    dataType: 'json',
    contentType: 'application/json',
    success: function(response) {
      renderThyronomicsOffers(benId, response ? response.THYROOFFER_MASTER : []);
      unblockUI(formName);
      $('#btn-offer-price').hide();
      $('#btn-book').show();
    },
    error: function(error) {
      console.error('error invoking ThyronomicsOffer');
      unblockUI(formName);
      $('#btn-offer-price').hide();
      $('#btn-book').show();
    }
  });
}
  
function renderThyronomicsOffers(beneficiaryId, thyronomicsOffers, benContainer) {
  var beneficiary = null;
	if(!benContainer) {
	  var beneficiaryCheck = $($('[value='+beneficiaryId+']')[0])
	  beneficiary = $(beneficiaryCheck.parents('.benificiary-item-preview-mode.row')[0]);
	} else {
	  beneficiary = benContainer;
	}

	if (beneficiary && thyronomicsOffers && thyronomicsOffers.length) {

		var thyronomicsConatiner = $(beneficiary.find('.thyronomics')[0]);
    thyronomicsConatiner.empty();
    updateBeneficiaryWiththyronomicsOffers(beneficiaryId, thyronomicsOffers);
		var thyronomicsTemplate = 'thyronomicsTemplate';
        var appendHtml = function (offer) {

            var templatedHtml = getTemplatedHtml(thyronomicsTemplate,
                {
                    code: offer.PRODUCTCODE,
                    name: offer.PRODUCTNAME,
                    testsCount: offer.TESTS_COUNT,
                    price: offer.ADD_COST,
                    benId: beneficiaryId
                });

            thyronomicsConatiner.append(templatedHtml);
        };

		thyronomicsOffers.forEach(appendHtml);
    beneficiary.find('.cart-button').removeClass('hide');
    if(!benContainer) {
      $('#btn-offer-price').hide();
      $('#btn-book').show();
    }
	}
}

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

function getThyronomicsAPIDetailsFromLS() {
  
  var response = getObjectFromLS('LOGIN_DETAILS');
  // var body = response ? response.body : null;
  if (response && !isEmpty(response)) {
    
    // body = JSON.parse(body);
    return {
      apiKey : response.API_KEY,
      mobileNumber : response.MOBILE
    };
  } 
  else {
    return {
      apiKey : 'yLZ4cKcEgPsnZn1s9b9FHhR9cUbO4AdM0z3fvmKQjiw=',
      mobileNumber : localStorage.getItem('customerPhoneNumber')
    }
  }

}

function updateBeneficiaryWiththyronomicsOffers(benId, offers) {
  if (benId && offers && offers.length) {
    var beneficiaries = getObjectFromLS(lsObject.BENEFICIARY);
    var beneficiary = getObjectFromLS(lsObject.BENEFICIARY, benId);
    beneficiary['thyronomicsOffers'] = offers;
    beneficiaries[benId] = beneficiary;
    setObjectToLS(lsObject.BENEFICIARY, beneficiaries);
    $('#cartDiscount').text(0);
  }
}

// update beneficiaryItem and global item list
function updateLSWithThyronomicsOffers(benId, selectedItems, self) {
  var beneficiaryList = getObjectFromLS(lsObject.BENEFICIARY);
  beneficiaryList[benId].items = [];
  beneficiaryList[benId].thyronomicsOffers = [];
  selectedItems.map(function(item) {
    beneficiaryList[benId].items.push(item.PRODUCTCODE);
  });
  
  setObjectToLS(lsObject.BENEFICIARY, beneficiaryList);  
  var itemList = getObjectFromLS(lsObject.ITEMS);
  
  selectedItems.map(function(item) {
    var itemObj = {
      name: item.PRODUCTNAME,
      rate: item.PAYABLE,
      type: item.PRODUCT_TYPE
    };
    
    if (!itemList[item.PRODUCTCODE]) {
      itemList[item.PRODUCTCODE] = itemObj;
    }
  });
  
  setObjectToLS(lsObject.ITEMS, itemList);
  // $(self).parent().parent().parent().addClass('hide');
  cartZerothCase();
  updatePriceInCart();
}

function updateBeneficiaryForSelectedOffer(self, benId) {

    var beneficiary = $($(self).parents('.benificiary-item-preview-mode.row')[0]);
	var selectedItem = beneficiary.find('input[type=radio]:checked');
	var selectedItemIds = [];
	if (selectedItem.length > 0) {
	  _.map(selectedItem, function(item) {
	    item = $(item);
	    var itemId = item.attr('data-code');
          selectedItemIds.push(itemId);
	  });
	  
	  localStorage.setItem('LOYALTY_DISCOUNT', '0');
	  localStorage.setItem('ONLINE_DISCOUNT', '0');
	  
	  getThyroomicsOfferFromId(benId, selectedItemIds, self);
	} else {
	  alert('please select an item please');
	}
}


function getThyroomicsOfferFromId(benId, itemIds, self) {
  
  if (!benId && !itemIds && itemIds.length) {
    console.log('getThyroomicsOfferFromId:  error while getting item');
    return;
  }
  
  var beneficiary = getObjectFromLS(lsObject.BENEFICIARY, benId);  
  var thyronomicsOffers = beneficiary['thyronomicsOffers'];
    if (thyronomicsOffers && thyronomicsOffers.length) {
    var selectedOffers = [];    
    itemIds.map(function(itemId) {
      var foundItem = thyronomicsOffers.find(function(offer) {
        return offer.PRODUCTCODE == itemId;
      });
      if (foundItem) {
        selectedOffers.push(foundItem);
      }
    });    
    
    if (selectedOffers.length > 0) {
      updateLSWithThyronomicsOffers(benId, selectedOffers, self);
    } else {
      console.log('getThyroomicsOfferFromId:  error while getting item');
    }
    
  } else {
    console.log('getThyroomicsOfferFromId:  error while getting item');
  } 
}

function getthyronomicsOffersForAllBeneficiaries() {  
  var beneficiaries = getObjectFromLS(lsObject.BENEFICIARY);  
  if (beneficiaries) {
    for(benId in beneficiaries) {
    getThyronomicsOffers(benId);
    }
  } else {
    console.log('no beneficiaries found');
  }
}

function getItemsOfBeneficiaryByIndex(index) {
  if(index >= 0) {
    var benList = getObjectFromLS(lsObject.BENEFICIARY);
    var itemList = getObjectFromLS(lsObject.ITEMS);
    var benIndexArr = Object.keys(benList);
    var benId = benIndexArr[index];
    if(benId) {
      var itemIdList = benList[benId].items;
        var benByIndex = {
            benId: benId,
            items: []
        };
      for(var i = 0; i < itemIdList.length; i++) {
        var item = itemList[itemIdList[i]];
        item.id = itemIdList[i];
        benByIndex.items.push(item);
      }
      return benByIndex;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

function updateBenificiariesFromResponseView(beneficiries) {
  beneficiariesToBeUpdates = [];
  
    var processBenificiary = function (beneficary) {
        var beneficaryNo = parseInt(beneficary.BenNo) - 1;
        var beneficaryDetails = getItemsOfBeneficiaryByIndex(beneficaryNo);
        var updatedObj = getUpdatedItemsForBeneficiary(beneficaryDetails.items, beneficary.product_code, beneficaryDetails.benId);
        var updatedItemIds = updatedObj.newItems.map(function (item) { return item.id; });
        updateItemsInBeneficiryForExistingItems(beneficaryDetails.benId, updatedItemIds);
        if (updatedObj.callback) {
            updatedObj.callback();
        }
    };

	beneficiries.forEach(processBenificiary);	
	cartZerothCase();	
	updateMessageForBeneficary();
}

function updateItemsForBenificiary(beneficiaryId, oldItemId, newItemId) {
  var beneficiaryList =  getObjectFromLS(lsObject.BENEFICIARY);
  var oldFoundIndex =  beneficiaryList[beneficiaryId].items.indexOf(oldItemId);
  var newFoundIndex = beneficiaryList[beneficiaryId].items.indexOf(newItemId);
  if (oldFoundIndex != -1) {
    beneficiaryList[beneficiaryId].items.splice(oldFoundIndex, 1);
    beneficiaryList[beneficiaryId].removedOfferId = oldItemId;
  }
  if (newFoundIndex === -1) {
    beneficiaryList[beneficiaryId].items.push(newItemId);  
  }
  setObjectToLS(lsObject.BENEFICIARY, beneficiaryList);
}

function getUpdatedItemsForBeneficiary(items, updatedItems, beneficiaryId) {

	var newItems = [];
	updatedItems = updatedItems ? updatedItems.split(',') : [];
	var newOfferCallback = Function.prototype;

	var compareItems = function(item) {
		var compareVal = "";
		var isAvailable = false;
		
		var isItemAnOffer = compareString(item.type, "offer");
		var itemIdsForBen = _.map(items, 'id');
		var newOfferItemId = null;
		
		updatedItems.map(function(updatedItemId) {
		  var lsItems = getObjectFromLS(lsObject.ITEMS);
		  var itemIds = Object.keys(lsItems);
		  var isNameExist = false;
		  
		  itemIds.map(function(id) {
		    if (lsItems[id].name == updatedItemId) {
		      isNameExist = true;
		    }
		  });
		  
		  if (!newOfferItemId && !itemIds.includes(updatedItemId) && !isNameExist) {
		    newOfferItemId = updatedItemId;
		  }
		});

		compareVal = compareString(item.type, "profile") ? item.name : item.id;

		updatedItems.forEach(function(updatedItem){
			if (compareString(updatedItem, compareVal)) {
				isAvailable = true;
			} else if (compareString(item.type, "offer") && newOfferItemId == updatedItem) {
			  isAvailable = true;
                newOfferCallback = function () {
                    updateItemsForBenificiary(beneficiaryId, compareVal, newOfferItemId);
                };
			}
		});
		
		return isAvailable;
	};

	newItems = items.filter(compareItems);
	
	var itemsRemovedForBen = [];
	
	items.map(function(item) {
	  var isPresent = false;
	  newItems.map(function(newItem) {
	    if (newItem.id == item.id) {
	      isPresent = true;
	    }
	  });
	  
	  if (!isPresent) {
	    itemsRemovedForBen.push(item.name);
	  }
	});
	
	itemsRemoved[beneficiaryId] = itemsRemovedForBen;
	return { 'newItems':newItems, 'callback': newOfferCallback };
}

var itemsRemoved = {};

function compareString(a, b) {
	a = a ? a.toLowerCase().trim() : "";
	b = b ? b.toLowerCase().trim() : "";
	return a==b;
}

function updateItemsInBeneficiryForExistingItems(benId, items) {
  var beneficiary = getObjectFromLS(lsObject.BENEFICIARY, benId);
  var beneficiariesList = getObjectFromLS(lsObject.BENEFICIARY);
  
  if (beneficiary && items && items.length > 0) {
    if (beneficiary.items.length != items.length) {
      beneficiariesToBeUpdates.push(benId);  
    }
    
    beneficiary.items = items;
    beneficiariesList[benId] = beneficiary;
    setObjectToLS(lsObject.BENEFICIARY, beneficiariesList);    
  }  
}

function updateMessageForBeneficary() {
  beneficiariesToBeUpdates.forEach(function(benId){
    var ben = $('[data-id="'+benId+'"] .updated-offers');
    if (ben && itemsRemoved[benId].length > 0) {
      var removedItemsString = itemsRemoved[benId].toString();
      var isAre = itemsRemoved[benId].length > 1 ? ' are ' : ' is ';
      ben.text(removedItemsString + isAre + "already part of one of the selected Profiles");
    }
  });
}

function updateMessageForMaxOfferLimit(benId) {
  var ben = $('[data-id="'+benId+'"] .updated-offers');
  if (ben) {
    ben.text('You can only add a maximum of 1 offer per beneficiary.');
  }
}

function getItemsNameForRequest(itemIds) {
	var globalItems = getObjectFromLS(lsObject.ITEMS);
    var itemsForRequest = [];
	if (globalItems) {

        var selectItem = function (itemId) {
            var item = globalItems[itemId];
            var isItemAnOffer = (!item || (item.hasOwnProperty('type') && compareString(item.type, 'offer')));
            if (item && !isItemAnOffer) {
                itemsForRequest.push(compareString(item.type, 'profile') ? item.name : itemId);
            }
        };
		itemIds.forEach(selectItem);
	}
	return itemsForRequest;
}

function clearBeneficiaryAndItems() {
	setObjectToLS(lsObject.ITEMS, {});
	clearItemsForAllBeneficiaries();
	updateCartCount();
// 	cartZerothCase();

	var homeIcon = $('.col-md-4.logo a');
	if (homeIcon.length > 0) {
		homeIcon = homeIcon[0];
		homeIcon.click();
	}
} 

function clearItemsForAllBeneficiaries() {

	var beneficiries = getObjectFromLS(lsObject.BENEFICIARY);
	for( benId in beneficiries) {
		beneficiries[benId].items = [];
	}
    setObjectToLS(lsObject.BENEFICIARY, beneficiries);
}