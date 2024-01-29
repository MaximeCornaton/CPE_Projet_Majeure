package com.cpe.springboot.matchservice;

import com.cpe.springboot.matchservice.models.UserDTO;
import com.cpe.springboot.matchservice.services.MatchService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Matchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.doReturn;

@SpringBootTest
class MatchServiceApplicationTests {

	@Autowired
	private MatchService matchService;

	@MockBean
	private RestTemplate restTemplate;

	private List<UserDTO> users = new ArrayList<>();

	@BeforeEach
	public void setup() {
		users.add(new UserDTO("a","user1","password",100,100,100,100,1,"mail"));
		users.add(new UserDTO("b","user2","password",100,100,100,100,1,"mail"));
		users.add(new UserDTO("c","user3","password",100,100,100,100,1,"mail"));
	}

	@Test
	public void testRecommendProfilesSuccess() {
		// Create a ResponseEntity with the simulated response
		ResponseEntity<List<UserDTO>> response = new ResponseEntity<>(users, HttpStatus.OK);
		// Use the mockRestServiceServer to simulate the response from the UserService
		doReturn(response).when(restTemplate).exchange(
				Matchers.anyString(),
				Matchers.<HttpMethod>any(),
				Matchers.<HttpEntity<?>>any(),
				Matchers.<ParameterizedTypeReference<List<UserDTO>>>any()
		);

		UserDTO recommendedUser = matchService.recommendProfiles("a");
		assertThat(recommendedUser).isNotNull();
		assertThat(recommendedUser.getId()).isNotEqualTo("a");
	}


}
