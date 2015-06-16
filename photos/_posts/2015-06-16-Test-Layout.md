---
  title: Japan
  subtitle: "Misc"
  layout: photo
  photoset: 72157629263560201
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
