module.exports = function($scope)
{
    lStore = localStorage;
    var workspace = angular.fromJson(lStore.getItem("workspace")) ||
    {
        "Name": "",
        "Themes": []
    };

    $scope.workspace = workspace;

    // Deletes all themes from the workspace
    workspace.clear = function()
    {
        if (workspace.Themes) workspace.Themes = [];
        workspace.updateStorage();
    };

    // Updates the workspace in localStorage
    workspace.updateStorage = function()
    {
        lStore.setItem('workspace', angular.toJson(workspace));
    };

    // Deletes a theme from the Workspace
    workspace.deleteTheme = function(theme)
    {
        for (var i = workspace.Themes.length - 1; i >= 0; i--)
        {
            if (workspace.Themes[i].ID === theme.ID) workspace.Themes.splice(i, 1);
        }
        workspace.updateStorage();
    };

    // Adds a theme to the workspace
    workspace.addTheme = function(theme)
    {
        var defaultTheme = {
            "Name": "",
            "ANSI 0": "#1d1d19",
            "ANSI 1": "#d11c24",
            "ANSI 2": "#a7d42c",
            "ANSI 3": "#d8d067",
            "ANSI 4": "#61b9d0",
            "ANSI 5": "#695abc",
            "ANSI 6": "#d63865",
            "ANSI 7": "#ffffff",
            "ANSI 8": "#1d1d19",
            "ANSI 9": "#d22a24",
            "ANSI 10": "#a7d42c",
            "ANSI 11": "#d8d067",
            "ANSI 12": "#61b9d0",
            "ANSI 13": "#695abc",
            "ANSI 14": "#d63865",
            "ANSI 15": "#ffffff",
            "Background": "#1d1e1a",
            "Bold": "#ffffff",
            "Cursor Text": "#a6e22e",
            "Cursor": "#708284",
            "Foreground": "#f6f6ef",
            "Selected Text": "#ffffff",
            "Selection": "#9e540f"
        };

        theme = typeof theme === 'undefined' ? defaultTheme : theme;

        // add a unique ID to the theme
        theme.ID = Date.now();

        workspace.Themes.push(theme);
        workspace.updateStorage();
    };

    // colorpicker
    var colorpicker = {
        isActive: false,
        colorLabel: '',
        master: new colr().fromHex('#000000'),
        initer:
        {
            theme: null,
            color: null
        }
    };

    colorpicker.hex = colorpicker.master.toHex();
    colorpicker.rgb = colorpicker.master.toRgbObject();
    colorpicker.hsl = colorpicker.master.toHslObject();

    $scope.colorpicker = colorpicker;

    colorpicker.close = function()
    {
        colorpicker.isActive = false;
    };

    colorpicker.open = function()
    {
        colorpicker.isActive = true;
    };

    colorpicker.populate = function(colorlabel, color, themeID, colorID)
    {
        // show the colorpicker element
        colorpicker.open();

        colorpicker.colorLabel = colorlabel;

        color = new colr().fromHex(color);

        colorpicker.hex = color.toHex();
        colorpicker.rgb = color.toRgbObject();
        colorpicker.hsl = color.toHslObject();

        colorpicker.initer.theme = themeID;
        colorpicker.initer.color = colorID;
    };

    colorpicker.updateColor = function(format, themeid)
    {
        var hexcolor = null,
            rgbcolor = null,
            hslcolor = null,
            hexcolorisValid = true,
            rgbcolorisValid = true,
            hslcolorisValid = true;

        try
        {
            hexcolor = new colr().fromHex(colorpicker.hex);
        }
        catch (e)
        {
            hexcolorisValid = false;
        }

        try
        {
            rgbcolor = new colr().fromRgbObject(colorpicker.rgb);
        }
        catch (e)
        {
            rgbcolorisValid = false;
        }

        try
        {
            hslcolor = new colr().fromHslObject(colorpicker.hsl);
        }
        catch (e)
        {
            hslcolorisValid = false;
        }

        if (format === 'hex' && hexcolorisValid)
        {
            colorpicker.rgb = hexcolor.toRgbObject();
            colorpicker.hsl = hexcolor.toHslObject();
        }

        if (format === 'rgb' && rgbcolorisValid)
        {
            colorpicker.hex = rgbcolor.toHex();
            colorpicker.hsl = rgbcolor.toHslObject();
        }

        if (format === 'hsl' && hslcolorisValid)
        {
            colorpicker.hex = hslcolor.toHex();
            colorpicker.rgb = hslcolor.toRgbObject();
        }

        if (colorpicker.initer.theme !== null && colorpicker.initer.color !== null)
        {
            var currTheme = workspace.Themes.filter(function(obj)
            {
                return obj.ID == colorpicker.initer.theme;
            });

            if (hexcolorisValid && rgbcolorisValid && hexcolorisValid)
            {
                currTheme[0][colorpicker.initer.color] = hexcolor.toHex();
                workspace.updateStorage();
            }
        }
    };
};
