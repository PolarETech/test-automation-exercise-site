@navigation @mobile
Feature: Navigation menu test with mobile screen

  Scenario: toggles expand navigation menu
    Given I am on the Home view
    Then the Hamburger-Icon should be displayed in the header
    And the Navigation-Menu should be closed in the header
    When I click the Hamburger-Icon in the header
    Then the Navigation-Menu should be opened in the header
    When I click the Hamburger-Icon in the header
    Then the Navigation-Menu should be closed in the header

  Scenario: moves to Home view after selecting Top Logo in navigation bar
    Given I am on the About view
    When I click the Top-Logo in the header
    Then the page title should be correct as the Home view

  Scenario Outline: moves to correct view after selecting link in navigation menu
    Given I am on the <fromView> view
    When I click the Hamburger-Icon in the header
    Then the <linkText> link should be displayed in the header
    When I click the <linkText> link in the header
    Then the page title should be correct as the <afterView> view

    Examples:
    | fromView | linkText   | afterView |
    | About    | 'Home'     | Home      |
    | Home     | 'About'    | About     |
    | Home     | 'Login'    | Login     |
    | Home     | 'TodoList' | Login     |

  @login
  Scenario: moves to Home view and unsets auth token cookie after selecting 'Logout' in navigation menu
    Given I am already logged in
    And I am on the Home view
    When I click the Hamburger-Icon in the header
    Then the 'Logout' link should be displayed in the header
    When I click the 'Logout' link in the header
    Then the page title should be correct as the Home view
    And the 'ログアウトしました' toast should be pop-up
    And the login token cookie should be empty

  Scenario: moves to TodoList view after selecting 'TodoList' in navigation menu with logged in
    Given I am already logged in
    And I am on the Home view
    When I click the Hamburger-Icon in the header
    Then the 'TodoList' link should be displayed in the header
    When I click the 'TodoList' link in the header
    Then the page title should be correct as the TodoList view

  Scenario: closes navigation menu after moving view
    Given I am on the Home view
    When I click the Hamburger-Icon in the header
    Then the Navigation-Menu should be opened in the header
    When I click the About-Button in the Home view
    Then the page title should be correct as the About view
    And the Navigation-Menu should be closed in the header
    When I click the Hamburger-Icon in the header
    Then the Navigation-Menu should be opened in the header
    When I click the 'Home' link in the header
    Then the page title should be correct as the Home view
    And the Navigation-Menu should be closed in the header
