package com.azadeh.skillmatch;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@Disabled("Disabled until test database configuration is added for CI.")
@SpringBootTest
class SkillmatchApplicationTests {

	// Basic Spring context test disabled because CI does not provide PostgreSQL yet.
	@Test
	void contextLoads() {
	}
}