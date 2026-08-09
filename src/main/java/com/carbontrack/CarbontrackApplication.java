package com.carbontrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.cache.annotation.EnableCaching;
import io.github.cdimascio.dotenv	.Dotenv;

@SpringBootApplication
@EnableCaching
public class CarbontrackApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
			.ignoreIfMissing()
			.systemProperties()
			.load();
		
		// Set environment variables as system properties
		dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
		
		SpringApplication.run(CarbontrackApplication.class, args);
	}

	@Bean
	public FlywayMigrationStrategy flywayMigrationStrategy() {
		return flyway -> {
			flyway.repair();
			flyway.migrate();
		};
	}

}
