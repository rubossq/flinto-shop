function setFilter(filterCategoryUrl){
    var category = $("#categorySelect option:selected").eq(0).val();
    document.location.href = filterCategoryUrl + category;
}