<?php $body_class = "contact" ?>
<?php $page_title = "Kontakt" ?>
<?php include_once($_SERVER["LOCAL_PATH"]."/templates/www.header.php") ?>

<div id="maincontent" class="i:contact">

	<div class="address corporate">
		<h3>Kontakt</h3>
		<div class="vcard company" itemscope itemtype="http://schema.org/Organization">
			<div class="name fn org" itemprop="name">PeopleGroup A/S</div>
			<div class="adr" itemprop="address" itemscope itemtype="http://schema.org/Address">
				<div class="street-address" itemprop="street-address">Vester Farimagsgade 41</div>
				<div class="city"><span class="postal-code" itemprop="postal-code">1606</span> <span class="locality" itemprop="locality">København V</span></div>
				<div class="country-name" itemprop="country-name">Danmark</div>
			</div>
			<div class="tel" itemprop="tel"><a href="callto:+4572215100">+45 7221 5100</a></div>
			<div class="email" itemprop="email"><a href="mailto:info@peoplegroup.com">info@peoplegroup.com</a></div>
		</div>
		<div class="directions_holder">
			<a href="http://maps.google.dk/maps?saddr=&amp;daddr=Vester+Farimagsgade+41+1606+K%c3%b8benhavn+V" class="directions" target="_blank">Find vej</a>
		</div>
	</div>

	<div id="map_canvas"></div>

</div>

<ul class="addresses">
	<li>
		<div class="vcard person" itemscope itemtype="http://schema.org/Person">
			<div class="image">
				<img alt="Henrik Juul" class="photo" itemprop="image" src="/attachments/people/29/juul_frontend_small.jpg" />
			</div>
			<div class="name fn" itemprop="name">Henrik Juul</div>
			<div class="role" itemprop="role">Partner, kreativ direktør</div>
			<div class="tel" itemprop="tel"><a href="callto:+4572215100">+45 72 21 51 00</a></div>
			<div class="email" itemprop="email"><a href="mailto:info@peoplegroup.dk">info@peoplegroup.dk</a></div>
		</div>
	</li>
	<li>
		<div class="vcard person" itemscope itemtype="http://schema.org/Person">
			<div class="image">
				<img alt="Jan Duckert" class="photo" itemprop="image" src="/attachments/people/30/duckert_frontend_small.jpg" />
			</div>
			<div class="name fn" itemprop="name">Jan Duckert</div>
			<div class="role" itemprop="role">Koncerndirektør</div>
			<div class="tel" itemprop="tel"><a href="callto:+4522655152">+45 22 65 51 52</a></div>
			<div class="email" itemprop="email"><a href="mailto:jd@wdp.dk">jd@wdp.dk</a></div>
		</div>
	</li>
</ul>

<?php include_once($_SERVER["LOCAL_PATH"]."/templates/www.footer.php") ?>
