---
  title: Jackson Hole
  subtitle: "Ski trip"
  layout: photo
  thumbnail: https://c1.staticflickr.com/1/452/19032952905_f990c4abb3_n.jpg
  photoset: 72157654474728070
  tags:
  - Travel
  - America
---

{% if page.photoset %}
{% for photo in page.photos %}
<figure>
<img src="{{ photo.urlFullSize }}" alt="{{ photo.description }}" />
<figcaption class="exif">
<p><label>F. Length</label> {{ photo.focalLength }}</p>
<p><label>S. Speed</label> {{ photo.shutterSpeed }} s</p>
<p><label>Aperture</label> ƒ/{{ photo.aperture }}</p>
<p><label>ISO</label> {{ photo.iso }}</p>
<p><label>Taken</label> {{ photo.creationDate | date: "%b %Y" }}</p>
</figcaption>
{% if photo.description != '' %}
<figcaption class="description">
{{ photo.description }}
</figcaption>
{% endif %}
</figure>
{% endfor %}
{% endif %}
