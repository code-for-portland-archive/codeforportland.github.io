(function($){
    var hackerDirectory = hackerDirectory || {};

    hackerDirectory.hackers = [];

    hackerDirectory.initData = function(hackers)
    {

        hackers
            .map(function (hacker, index, array) {
                hackerDirectory.hackers.push(hacker);
                return hacker["skills"];
            }, self)
            .reduce(function (previousValue, currentValue, index, array) {
                return previousValue.concat(currentValue.filter(function(element){
                    return previousValue.every(function(e){
                        return  element.name != e.name;
                    });
                }));
            })
            .sort(function(a, b){
                return a.name < b.name ? -1 : 1;
            })
            .forEach(function (value, index, array) {
                if (value != undefined)
                {
                    hackerDirectory.addSkill(value);
                }
            }, self);
        hackerDirectory.filterHackers();
    };

    hackerDirectory.skillTemplate = $("#skill-filter-template");
    hackerDirectory.hackerTemplate = $("#hacker-template");
    hackerDirectory.hackerSkillTemplate = $("#hacker-details-skill");

    hackerDirectory.addSkill = function(skill)
    {
        $("#skill-list").append(
            $(hackerDirectory.skillTemplate.html()
                .replace(/\${skill}/g, skill.name)
            ).clone());
    };

    hackerDirectory.fetchHackerData = function()
    {
        $.ajax({
                url: "/hackers/hackers.html",
                dataType: "json",
                success: function (data, status, xhr) {
                    hackerDirectory.initData(data);
                },
                error: function(xhr, status, error){
                    //TODO: error handling
                    console.log("xhr: " + xhr);
                    console.log("status: " + status);
                    console.log("error: " + error);
                }
            }
        );
    };

    hackerDirectory.filterHackers = function()
    {
        hackerDirectory.clearHackers();
        hackerDirectory.hackers
            .sort(function (a, b) {
                return a.name < b.name ? -1 : 1;
            })
            .filter(function (value, index, array) {
                return hackerDirectory.matchesFilters(value);
            })
            .forEach(function (value, index, array) {
                hackerDirectory.addHackerToView(value);
            });
    };

    hackerDirectory.addHackerToView = function(hacker)
    {
        var hackerHTML = $(hackerDirectory.hackerTemplate.html().replace(/\${name}/g, hacker.name)).clone();
        hacker["skills"]
            .sort(function (a, b) {
                return a.name < b.name ? -1 : 1;
            })
            .forEach(function (skill) {
                $(".hacker-details", hackerHTML).append(
                    hackerDirectory.hackerSkillTemplate.html()
                        .replace(/\${name}/g, skill.name)
                        .replace(/\${level}/g, skill.level)
                ).clone();
            });
        $("#hacker-list").append(hackerHTML);
    };

    hackerDirectory.matchesFilters = function (hacker) {

        if (Object.keys(hackerDirectory.enabledFilters).length == 0) {
            return true;
        }
        return Object.keys(hackerDirectory.enabledFilters)
            .filter(function (key) {
                return hackerDirectory.enabledFilters[key] == true;
            })
            .every(function (filterName) {
                var matchingSkills = hacker["skills"].filter(function (f) {
                    if (f.name == filterName) {
                        return true;
                    }
                });
                return matchingSkills.length > 0;
            });
    };

    hackerDirectory.clearHackers = function(){
        $("#hacker-list").html("");
    };

    hackerDirectory.bindEvents = function(){
        $("#skill-list").on("click", ".skill-link", function(){
            $(this).toggleClass("selected");

            var filter = $(this).attr("data-filter");

            if ($(this).hasClass("selected"))
            {
                hackerDirectory.enabledFilters[filter] = true;
            }
            else
            {
                delete hackerDirectory.enabledFilters[filter];
            }
            hackerDirectory.filterHackers();
            return false;
        });

        $("#hacker-list").on("click", ".hacker-link", function(){
            //console.log("Showing skills.");
            $(".hacker-details", $(this).parents(".hacker")).toggleClass("hacker-details-showing");
            return false;
        });

    };

    hackerDirectory.enabledFilters = {};

    $(document).ready(function(){
        hackerDirectory.fetchHackerData();
        hackerDirectory.bindEvents();
    });
})(jQuery);