import {Init} from "ng-next";
import {Controller, Inject} from "ng-next"

@Controller("GallerySectionController")
export class GallerySectionController
{

    /**
     * @type {InputService}
     */
    @Inject InputService;

    /**
     * @type {GalleryService}
     */
    @Inject GalleryService;

    /**
     * Toastr notifications
     */
    @Inject toastr;

    /**
     * Sweet alerts
     */
    @Inject SweetAlert;

    /**
     * Angular scope
     */
    @Inject $scope;

    /**
     * List with all available galleries
     * @type {Array}
     */
    galleries = [];

    /**
     * The current active gallery
     * @type {null}
     */
    gallery = undefined;

    /**
     * Indicator if galleries are loading
     * @type {boolean}
     */
    loadingGalleries = false;

    /**
     * Upload progress
     * @type {number | null}
     */
    progress = null;

    set galleryName(name)
    {
        this.gallery = this.galleries.find(g => g.name == name);
    }

    get galleryName()
    {
        return !!this.gallery ? this.gallery.name : undefined;
    }

    /**
     * Loads all galleries from the server
     */
    @Init async loadGalleries()
    {
        try
        {
            this.loadingGalleries = true;
            this.galleries.length = 0;
            for (let gallery of await this.GalleryService.all()) {
                this.galleries.push(gallery);
            }
            this.gallery = this.galleries[0];
        } catch (e)
        {
            this.toastr.error("Gallerie konnte nicht geladen werden. Bitte laden Sie die Seite neu");
        }
        finally
        {
            this.loadingGalleries = false;
        }
    }


    /**
     * Creates a new gallery
     */
    async newGallery()
    {
        let name = await this.InputService.input({
            title : "Gallerie erstellen",
            text : "Bitte geben sie den Namen der neuen Gallerie ein",
            placeholder : "Name",
            button : "Erstellen"
        });

        try
        {
            await this.GalleryService.create(name);
            await this.loadGalleries();
            this.gallery = this.galleries.find(g => g.name == name);
            this.toastr.success("Die Gallerie wurde erfolgreich erstellt");
        } catch (e)
        {
            if (e.status == 400) {
                this.toastr.error(`Gallerie ${name} existiert bereits!`, `Fehler`);
            } else {
                this.toastr.error(`Die Gallerie konnte nicht erstellt werden`);
            }
        }
    }

    /**
     * Deletes the currently selected gallery
     */
    async deleteGallery()
    {
        if (!this.gallery) return;

        this.SweetAlert.swal({
            title: 'Gallerie löschen?',
            text: `Die Gallerie '${this.gallery.name}' und alle Fotos werden unwiderrufbar gelöscht!`,
            type: 'warning',
            showCancelButton : true,
            confirmButtonText: 'Löschen',
            cancelButtonText: 'Abbrechen'
        }, async confirmed => {
            if (confirmed) {
                try
                {
                    await this.GalleryService.delete(this.gallery);
                    this.toastr.success(`Die Gallerie '${this.gallery.name}' wurde gelöscht!`, "Gallerie gelöscht");
                    await this.loadGalleries();
                } catch (e) {
                    this.toastr.error("Die Gallerie konnte nicht gelöscht werden", "Fehler");
                    console.error(e);
                }
            }
        });
    }

    async editName()
    {
        let name = await this.InputService.input({
            title : "Gallerie bearbeiten",
            text : "Bitte geben sie den neuen Namen ein",
            value : this.gallery.name,
            placeholder : "Neuer Name",
            button : "Ändern"
        });

        try
        {
            await this.GalleryService.editName(this.gallery, name);
            this.gallery.name = name;
            this.toastr.success("Der Name wurde erfolgreich geändert", "Namensänderung");
        } catch (e)
        {
            console.error(e);
            if (e.status == 400) {
                this.toastr.error(`Gallerie ${name} existiert bereits!`, `Fehler`);
            } else {
                this.toastr.error(`Die Gallerie konnte nicht bearbeitet werden`);
            }
        }
    }

    /**
     * Uploads the images to the server and reloads the gallery
     * @param images
     */
    async uploadImages(images)
    {
        if (!images || !images.length) {
            return;
        }

        this.progress = 0;

        try
        {
            let uploadedImages = [];
            for (let image of images)
            {
                try
                {
                    let promise = this.GalleryService.uploadImages(this.gallery, [image]);
                    promise.finally(undefined, progress => this.progress = 1 / progress.total * progress.loaded );
                    let response = await promise;
                    uploadedImages.push(... response.data.images);
                } catch (e) {
                    if (e) console.error(e);
                    this.toastr.warning(`Bild ${image.name} konnte nicht hochgeladen werden!`);
                }
            }

            this.gallery.images.unshift(... uploadedImages);
            this.toastr.success(`${uploadedImages.length} Bild${uploadedImages.length > 1 ? 'er' : ''} hinzugefügt`, "Hinzufügen");
        } catch (e)
        {
            if (e) console.error(e);
            this.toastr.error("Fehler beim hinzugen der Bilder", "Fehler");
        }
        finally {
            this.progress = null;
        }
    }

    async deleteImage(img) {
        try {
            let response= await this.GalleryService.deleteImage(this.gallery, img);
            this.gallery.images = this.gallery.images.filter(i => i.id != img.id);
            this.toastr.success("Bild wurde gelöscht");
        } catch (e) {
            this.toastr.error("Bild konnte nicht gelöscht werden!");
        }
    }
}
