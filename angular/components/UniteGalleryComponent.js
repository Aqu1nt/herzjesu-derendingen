import {WatchCollection} from "ng-next"
import {Inject, Component, Bind, Alias, View} from "ng-next"


//Define view as constant
const unite_gallery_component_view = '/views/components/unite-gallery-component.html';

@Alias('ugCtrl')
@View(unite_gallery_component_view)
@Component("uniteGallery")
export class UniteGalleryComponent
{

    /**
     * All images
     */
    @Bind("=") images;

    /**
     * Callback to delete an image
     */
    @Bind("&") delete;

    /**
     * Angular scope
     */
    @Inject $scope;

    /**
     * Angular timeout service
     */
    @Inject $timeout;

    /**
     * The element of this component (<unite-gallery>)
     */
    @Inject $element;

    /**
     * Angular template cache
     */
    @Inject $templateCache;

    /**
     * Angular compile service to reinit the directive forcing
     * ng-repeat to work after unite gallerys destroy()
     */
    @Inject $compile;

    /**
     * @type {null | UG_API}
     */
    unitegallery = null;

    /**
     * Unitegallery config
     * @type {*}
     */
    config = {
        gallery_theme: "compact",
        thumb_fixed_size: false,
        slider_enable_text_panel:true,
        strippanel_enable_handle:false,
        slider_enable_zoom_panel:false,
        slider_textpanel_enable_description: false
        // rid_num_rows: 2,						//maximum number of grid rows. If set to big value, the navigation will not appear.
        // theme_navigation_type: "bullets",
    };

    /**
     * Component constructor
     */
    constructor()
    {
        this.$element.addClass("animated");
    }

    /**
     * Watch to reinit unite gallery
     */
    @WatchCollection("images")
    setupGallery()
    {
        if (!this.images) {
            return;
        }

        //Destroy gallery if required
        if (this.unitegallery) {
            //Destroy
            this.unitegallery.destroy();

            //Recompile component ng-repeat
            let template = this.$templateCache.get(unite_gallery_component_view);
            let compiled = this.$compile(template)(this.$scope);
            this.$element.empty();
            this.$element.append(compiled);
        }

        this.$timeout(() => {
            this.unitegallery = this.$element.find("#unite-gallery").unitegallery(this.config);
            this.initDeleteImageButton();
        });
    }

    /**
     * Unite gallery doesn't have any delete buttons, so we have to initialize them manually
     */
    initDeleteImageButton()
    {
        if (this.config.gallery_theme == "compact") {
            let element = angular.element(".ug-slider-wrapper");
            let deleteBtn = angular.element("<div class='ug-slider-control ug-theme-default ug-remove-btn' ng-click='ugCtrl.deleteImage()' uib-tooltip='Bild löschen!' admin><i class='fa fa-trash'></i></div>");
            let compiled = this.$compile(deleteBtn)(this.$scope);
            element.append(compiled);
        }
    }

    deleteImage() {
        let imageThumb = angular.element(".ug-thumb-selected .ug-thumb-image").first().attr("src").split("/").pop();
        let image = this.images.find(i => i.thumb_path == imageThumb );
        this.delete({image});
    }
}
