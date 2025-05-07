<template>
  <aside
    :class="{
      'w-64': !isCollapsed,
      'w-16': isCollapsed,
      'h-screen': true,
      'fixed top-0 left-0 z-30': true,
      'bg-primary text-light-text dark:bg-dark-bg dark:text-dark-text': true,
      'shadow-lg flex flex-col': true,
      'transition-all duration-300': true,
      'lg:w-64': !isCollapsed && !isMobile,  // Ensure sidebar is wide on large screens
      'lg:w-20': isCollapsed && !isMobile,  // Collapsed sidebar on larger screens
      'sm:w-16': isCollapsed || isMobile, // Collapsed on small screens (mobile/tablet)
      'sm:w-64': !isCollapsed && isMobile,  // Wide sidebar on small screens (mobile/tablet)
    }"
  >
    <!-- Sidebar Header -->
    <div class="relative h-16 flex items-center justify-between px-4 border-b border-light-border dark:border-dark-border">
  <div class="flex items-center space-x-2 text-xl font-bold tracking-wide">
    <i class="mdi mdi-chicken"></i>
    <span v-if="!isCollapsed" class="whitespace-nowrap">Birdseye Admin</span>
  </div>

  <!-- Toggle Button for Collapsing Sidebar -->
  <button 
    @click="toggleSidebar" 
    class="fixed z-40 top-4 left-[calc(var(--sidebar-width)-2.5rem)] p-2 bg-light-accent dark:bg-dark-accent rounded-full shadow"
    :style="{ '--sidebar-width': isCollapsed ? '4rem' : '16rem' }"
  >
    <i :class="isCollapsed ? 'mdi mdi-chevron-right' : 'mdi mdi-chevron-left'"></i>
  </button>
</div>



    <!-- Sidebar Navigation -->
    <nav class="flex-grow px-4 space-y-2">
      <!-- Dashboard Link -->
      <NuxtLink
        to="/"
        class="flex items-center space-x-3 p-3 rounded-md hover:bg-light-accent dark:hover:bg-dark-accent transition-all"
        :class="{'bg-light-accent dark:bg-dark-accent': isActive('/')}"
      >
        <i class="mdi mdi-view-dashboard-outline"></i>
        <span v-if="!isCollapsed" class="transition-opacity duration-300 ease-in-out">Dashboard</span>
      </NuxtLink>

      <!-- Users Link -->
      <NuxtLink
        to="/users"
        class="flex items-center space-x-3 p-3 rounded-md hover:bg-light-accent dark:hover:bg-dark-accent transition-all"
        :class="{'bg-light-accent dark:bg-dark-accent': isActive('/users')}"
      >
        <i class="mdi mdi-account-group"></i>
        <span v-if="!isCollapsed" class="transition-opacity duration-300 ease-in-out">Users</span>
      </NuxtLink>

      <!-- Subscriptions Link -->
      <NuxtLink
        to="/subscriptions"
        class="flex items-center space-x-3 p-3 rounded-md hover:bg-light-accent dark:hover:bg-dark-accent transition-all"
        :class="{'bg-light-accent dark:bg-dark-accent': isActive('/subscriptions')}"
      >
        <i class="mdi mdi-credit-card-outline"></i>
        <span v-if="!isCollapsed" class="transition-opacity duration-300 ease-in-out">Subscriptions</span>
      </NuxtLink>

      <!-- Reports Link -->
      <NuxtLink
        to="/reports"
        class="flex items-center space-x-3 p-3 rounded-md hover:bg-light-accent dark:hover:bg-dark-accent transition-all"
        :class="{'bg-light-accent dark:bg-dark-accent': isActive('/reports')}"
      >
        <i class="mdi mdi-file-chart"></i>
        <span v-if="!isCollapsed" class="transition-opacity duration-300 ease-in-out">Reports</span>
      </NuxtLink>

      <!-- System Logs Link -->
      <NuxtLink
        to="/system-logs"
        class="flex items-center space-x-3 p-3 rounded-md hover:bg-light-accent dark:hover:bg-dark-accent transition-all"
        :class="{'bg-light-accent dark:bg-dark-accent': isActive('/system-logs')}"
      >
        <i class="mdi mdi-shield-lock-outline"></i>
        <span v-if="!isCollapsed" class="transition-opacity duration-300 ease-in-out">System Logs</span>
      </NuxtLink>

      <!-- System Settings Link -->
      <NuxtLink
        to="/settings"
        class="flex items-center space-x-3 p-3 rounded-md hover:bg-light-accent dark:hover:bg-dark-accent transition-all"
        :class="{'bg-light-accent dark:bg-dark-accent': isActive('/settings')}"
      >
        <i class="mdi mdi-cog-outline"></i>
        <span v-if="!isCollapsed" class="transition-opacity duration-300 ease-in-out">Settings</span>
      </NuxtLink>
    </nav>

    <!-- Logout Button -->
    <div class="p-4">
      <button
        @click="logout"
        class="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-light-accent dark:hover:bg-dark-accent transition-all"
      >
        <i class="mdi mdi-logout"></i>
        <span v-if="!isCollapsed">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    required: true,
  }
});

const emit = defineEmits(['toggleSidebar']);
const router = useRouter();

const toggleSidebar = () => {
  emit('toggleSidebar');
};

const isMobile = ref(false);

// Check screen size for mobile/tablet
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768; // Adjust based on your breakpoint
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);

  return () => {
    window.removeEventListener('resize', checkMobile);
  };
});

// Check if the current route is active
const isActive = (route) => {
  return router.currentRoute.value.path === route;
};

// Handle logout functionality
const logout = () => {
  // Add your logout logic here (e.g., clearing tokens, redirecting, etc.)
  console.log('Logging out...');
  router.push('/login'); // Redirect to login page after logout
};
</script>

<style scoped>
/* Optional: Customize the transition for collapsing */
button {
  transition: transform 0.3s ease;
}

nav a span {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.w-64 span, .w-16 span {
  transition: opacity 0.3s ease-in-out;
}

/* Center icons only in collapsed state */
.w-16 nav a {
  justify-content: center; /* Center the icon horizontally */
  text-align: center; /* Ensure text is centered when expanded */
}

.w-16 nav a i {
  margin: 0 auto; /* Center the icon horizontally */
}

.w-64 nav a {
  justify-content: flex-start; /* Left-align icons in full state */
  text-align: left;
}
:root {
  --sidebar-width: 16rem;
}

button {
  transition: transform 0.3s ease;
}

button.fixed {
  transition: left 0.3s ease;
}

/* Ensure the content inside the sidebar has room below the header */
aside nav {
  padding-top: 1rem;
}


/* Media Query for Mobile/Tablet */
@media (max-width: 768px) {
  .lg:w-64 {
    width: 100% !important; /* Full width for mobile/tablet */
  }
  .lg:w-20 {
    width: 100% !important;
  }

  /* Responsive padding adjustments */
  nav a {
    padding-left: 12px;
    padding-right: 12px;
  }

  nav a span {
    font-size: 0.875rem; /* Slightly smaller font size for mobile */
  }
}

@media (min-width: 768px) {
  nav a {
    padding-left: 16px;
    padding-right: 16px;
  }
}

@media (min-width: 1024px) {
  nav a {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
