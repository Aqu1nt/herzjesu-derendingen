import {Inject, WatchCollection, Component, Alias, Bind, View} from "../utils/Decorators"

//Define view as constant
const unite_gallery_component_view = '/views//components/unite-gallery-component.html';

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
            this.unitegallery = $("#unite-gallery").unitegallery({
                gallery_theme: "compact",
                thumb_fixed_size: false,
                slider_enable_text_panel:true,
                strippanel_enable_handle:false,
                slider_enable_zoom_panel:false,
                slider_textpanel_enable_description: false
                // grid_num_rows: 2,						//maximum number of grid rows. If set to big value, the navigation will not appear.
                // theme_navigation_type: "bullets",
            });
        });
    }
}