//Definizione di un meme
function Meme(id, img, title, creator, creator_name, isPrivate, fields, field1, field2, field3, color, font) {
    this.id = id;
    this.img = img;
    this.title = title;
    this.creator = creator;
    this.creator_name = creator_name;
    this.private = isPrivate;
    this.fields = fields;
    this.field1 = field1;
    this.field2 = field2;
    this.field3 = field3;
    this.color = color;
    this.font = font;
}

//Definizione di un template, ovvero dell'immagine di sfondo per un meme
function Image_Template(id, path, fields_img, field1_img, field2_img, field3_img) {
    this.id = id;
    this.path = path;
    this.fields_img = fields_img;
    this.field1_img = field1_img;
    this.field2_img = field2_img;
    this.field3_img = field3_img;
}

export {Meme, Image_Template};